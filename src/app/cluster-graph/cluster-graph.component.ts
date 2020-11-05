import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {GraphService} from '../services/graph.service';
import {GraphMapper, GraphModel} from '../models/graph.model';
import {Subscription} from 'rxjs';
import {ImagesService} from '../services/images.service';
import {ImageMapper, ImageModel} from '../models/image.model';
import {MatSidenav} from '@angular/material/sidenav';
import {webSocket} from 'rxjs/webSocket';
import ForceGraph, {ForceGraphInstance, NodeObject} from 'force-graph';
import {ClustersService} from '../services/clusters.service';
import {GraphJsonModel} from '../models/graphJson.model';
import {MatDialog} from '@angular/material/dialog';
import {ClusterInfoDialogComponent} from './cluster-info-dialog/cluster-info-dialog.component';
import {SERVER_CONFIG} from '../server.config';


@Component({
  selector: 'app-cluster-graph',
  templateUrl: './cluster-graph.component.html',
  styleUrls: ['./cluster-graph.component.css']
})

export class ClusterGraphComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('graph') graph: ElementRef;

  ws = webSocket(SERVER_CONFIG.websocket);
  openSidenav: boolean;
  images: ImageModel[];
  forceGraph: ForceGraphInstance;
  dataGraph: GraphModel;
  filteredGraph: GraphModel;

  sideNavDate: string;
  sideNavAuthor: string;
  sideNavAuthorLink: string;
  sideNavTweet: string;

  private intervalTimeMedium = 650000;
  private subscription: Subscription = new Subscription();
  private filteredSize = 0;
  private dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

  private static getColor(group: any): string {
    return '#' + ((group * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');
  }

  constructor(private graphService: GraphService, private clusterService: ClustersService, private imagesService: ImagesService,
              private graphMapper: GraphMapper, private imageMapper: ImageMapper, public filterDialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.forceGraph = ForceGraph()(this.graph.nativeElement);
    this.getGraph();
    setInterval(() => this.getGraph(), this.intervalTimeMedium);
  }

  ngOnInit() {
    this.connectWebsocket();
  }

  ngOnDestroy() {
    this.ws.complete();
    this.subscription.unsubscribe();
  }

  getGraph(): void {
    this.subscription.add(this.graphService.getGraph().subscribe(graph => {
      this.dataGraph = graph;
      this.filteredSize = this.dataGraph.nodes.map(node => node.size).reduce((a, b) => a + b, 0) / graph.nodes.length;
      this.filteredGraph = this.graphMapper.filterSize(this.dataGraph, this.filteredSize, true);
      this.forceGraph.graphData(this.filteredGraph)
        .onNodeClick(node => {
          this.onOpenSidenav(node);
        })
        // @ts-ignore
        .nodeCanvasObject(({id, x, y, size, group}, ctx) => {
          ctx.fillStyle = ClusterGraphComponent.getColor(group);
          ctx.beginPath();
          ctx.arc(x, y, Math.sqrt(size), 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = '10px Sans-Serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(size, x + Math.sqrt(size) + 5, y + Math.sqrt(size) + 5);
        })
        .nodeLabel(node => {
          // @ts-ignore
          const mappedUrl = this.imageMapper.mapSingleUrl(node.label);
          return `<img width="250px" height="200px" src=" ${mappedUrl}">`;
        });
    }));
  }

  connectWebsocket(): void {
    this.subscription.add(this.ws.asObservable().subscribe(graph => {
      if (!!graph && graph !== 'ping') {
        console.log('new update');
        const updateData: GraphModel = this.graphMapper.mapJsonToGraphModel(graph as GraphJsonModel);
        const nodes = this.dataGraph.nodes;
        const links = this.dataGraph.links;
        if (updateData.type === 'insert') {
          this.filteredGraph = this.graphMapper.filterSize({
            nodes: [...nodes, updateData.nodes[0]],
            links: [...links].concat(updateData.links)
          }, this.filteredSize, true);
          this.drawGraph();
        }
        if (updateData.type === 'update') {
          const index = nodes.map(node => node.id as string).indexOf(updateData.nodes[0].id);
          if (index >= 0) {
            nodes[index].size = updateData.nodes[0].size;
          }
          this.filteredGraph = this.graphMapper.filterSize({
            nodes: [...nodes],
            links: [...links]
          }, this.filteredSize, true);
          this.drawGraph();
        }
      }
    }));
  }

  onOpenSidenav(node: NodeObject) {
    this.sideNavAuthor = '@' + decodeURIComponent(node.author);
    this.sideNavDate = this.imageMapper.mapUnixTimestamp(node.timestamp);
    this.sideNavAuthorLink = 'https://twitter.com/intent/user?user_id=' + node.authorId;
    this.sideNavTweet = 'https://twitter.com/user/status/' + node.tweetLink.replace(/\D/g, '');
    this.openSidenav = true;
    this.subscription.add(this.imagesService.getImages(node.id).subscribe(images => this.images = this.imageMapper.mapImageUrl(images)));
  }

  closeSidenav() {
    this.sidenav.close();
  }


  private drawGraph() {
    this.forceGraph.graphData(this.filteredGraph);
  }

  openDialog() {
    const dialogRef = this.filterDialog.open(ClusterInfoDialogComponent, {
      height: '300px',
      width: '400px',
      data: {graphData: this.dataGraph, initVal: this.filteredSize}
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      this.filteredSize = result;
      this.updateFilteredGraph();
    }));
  }

  private updateFilteredGraph() {
    this.filteredGraph = this.graphMapper.filterSize({
      nodes: this.dataGraph.nodes,
      links: this.dataGraph.links
    }, this.filteredSize, true);
    this.drawGraph();
  }
}
