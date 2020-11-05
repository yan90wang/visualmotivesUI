import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {GraphService} from '../services/graph.service';
import {GraphMapper, GraphModel, Nodes} from '../models/graph.model';
import {MatSidenav} from '@angular/material/sidenav';
import {ImagesService} from '../services/images.service';
import {ImageMapper, ImageModel} from '../models/image.model';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle, ApexLegend, ApexTooltip
} from 'ng-apexcharts';
import {webSocket} from 'rxjs/webSocket';
import {GraphJsonModel} from '../models/graphJson.model';
import {ClusterInfoDialogComponent} from '../cluster-graph/cluster-info-dialog/cluster-info-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SERVER_CONFIG} from '../server.config';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-cluster-chart',
  templateUrl: './cluster-chart.component.html',
  styleUrls: ['./cluster-chart.component.css']
})
export class ClusterChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('chart') chart: ChartComponent;

  private subscription: Subscription = new Subscription();
  private filteredSize = 0;
  private chartData: GraphModel;

  chartOptions: Partial<ChartOptions>;
  filteredData: GraphModel;
  images: ImageModel[];

  openSidenav: boolean;
  sideNavDate: string;
  sideNavAuthor: string;
  sideNavAuthorLink: string;
  sideNavTweet: string;

  ws = webSocket(SERVER_CONFIG.websocket);

  constructor(public filterDialog: MatDialog, private graphService: GraphService, private imagesService: ImagesService,
              private graphMapper: GraphMapper, private imageMapper: ImageMapper) {
    this.setupChart();
  }

  ngOnInit(): void {
    this.connectWebsocket();
  }

  ngAfterViewInit() {
    this.subscription.add(this.graphService.getGraph().subscribe(graph => {
      this.filteredSize = graph.nodes.map(node => node.size).reduce((a, b) => a + b, 0) / graph.nodes.length;
      this.chartData = graph;
      this.chart.updateSeries(this.makeBubbleChartData());
    }));
  }

  ngOnDestroy() {
    this.ws.complete();
    this.subscription.unsubscribe();
  }

  private setupChart() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 600,
        type: 'bubble',
        events: {
          dataPointSelection: (event, chartContext, config) => {
            this.onOpenSidenav(config.w.config.series[config.seriesIndex].name);
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 0.8
      },
      xaxis: {
        tickAmount: 12,
        type: 'numeric',
        min: -5,
        max: 5,
      },
      yaxis: {
        tickAmount: 12,
        decimalsInFloat: 1,
        min: -5,
        max: 5,
      },
      legend: {
        show: false
      },
      tooltip: {
        custom: ({seriesIndex, w}) => {
          return this.getImageHtml(w, seriesIndex);
        }
      }
    };
  }

  private getImageHtml(w, seriesIndex) {
    const imageHtml = '<div position="relative"> <div display="block"> <img width="250px" height="200px" src="'
      + this.getImageUrl(w.config.series[seriesIndex].name) + '"> </div> <div display="block">' +
      '<div font-weight="bold">size: </div>' + w.config.series[seriesIndex].data[0][2] + '</div>' + '</div>';
    return imageHtml;
  }

  private parseXY(xy: string, position: number) {
    const splitArray = xy.split(',');
    // tslint:disable-next-line:radix
    const valArray = splitArray.map(val => parseFloat(val.replace(/[[\]]/g, '')));
    return valArray[position];
  }

  private makeBubbleChartData(): any[] {
    this.filteredData = this.graphMapper.filterSize(this.chartData, this.filteredSize, false);
    return this.createBubblesChartData(this.filteredData.nodes);
  }

  private createBubblesChartData(nodes: Nodes[]): any[] {
    const bubbles = [];
    for (const node of nodes) {
      const nodeData: number[] = [this.parseXY(node.xy, 0), this.parseXY(node.xy, 1), node.size];
      bubbles.push({
        name: node.id,
        data: [nodeData]
      });
    }
    return bubbles;
  }

  private getImageUrl(name: string) {
    let url = '';
    for (const node of this.filteredData.nodes) {
      if (node.id === name) {
        url = node.label;
      }
    }
    return this.imageMapper.mapSingleUrl(url);
  }

  private connectWebsocket(): void {
    this.subscription.add(this.ws.asObservable().subscribe(graph => {
      if (!!graph && graph !== 'ping') {
        const updateData: GraphModel = this.graphMapper.mapJsonToGraphModel(graph as GraphJsonModel);
        if (updateData.type === 'insert') {
          this.chartData.nodes.concat(updateData.nodes[0]);
          this.chart.appendData([this.createBubblesChartData(updateData.nodes)[0]]);
        }
        if (updateData.type === 'update') {
          const index = this.chartData.nodes.findIndex(bubble => bubble.id === updateData.nodes[0].id);
          if (index >= 0 ) {
            this.chartData.nodes[index].size = updateData.nodes[0].size;
            this.chart.updateSeries(this.makeBubbleChartData());
          }
        }
      }
    }));
  }

  private updateFilteredChart() {
    this.chart.updateSeries(this.makeBubbleChartData());
  }

  closeSidenav() {
    this.sidenav.close();
  }

  onOpenSidenav(nodeID: string) {
    for (const node of this.filteredData.nodes) {
      if (node.id === nodeID) {
        this.sideNavAuthor = '@' + decodeURIComponent(escape(node.author));
        this.sideNavDate = this.imageMapper.mapUnixTimestamp(node.timestamp);
        this.sideNavAuthorLink = 'https://twitter.com/intent/user?user_id=' + node.authorId;
        this.sideNavTweet = this.imageMapper.mapTweetLink(node.tweetLink);
      }
    }
    this.openSidenav = true;
    this.subscription.add(this.imagesService.getImages(nodeID).subscribe(images => this.images = this.imageMapper.mapImageUrl(images)));
  }

  openDialog() {
    const dialogRef = this.filterDialog.open(ClusterInfoDialogComponent, {
      height: '300px',
      width: '400px',
      data: {graphData: this.chartData, initVal: this.filteredSize}
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      this.filteredSize = result;
      this.updateFilteredChart();
    }));
  }
}
