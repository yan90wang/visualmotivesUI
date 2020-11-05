import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClusterJsonModel} from '../models/clusterJson.model';
import {map} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {ClusterModel, ClusterMapper} from '../models/cluster.model';
import {SERVER_CONFIG} from '../server.config';

@Injectable({providedIn: 'root'})
export class ClustersService {
  private clustersUrl = SERVER_CONFIG.base_url + '/clusters';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private clusterMapper: ClusterMapper) {
  }

  getAll(): Observable<ClusterModel[]> {
    return this.http.get<ClusterJsonModel[]>(this.clustersUrl, this.httpOptions)
      .pipe(
        map((clusters) => clusters.map((cluster) => this.clusterMapper.mapJsonToClusterModel(cluster))));
  }
}
