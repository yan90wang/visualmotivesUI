import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {GraphMapper, GraphModel} from '../models/graph.model';
import {GraphJsonModel} from '../models/graphJson.model';
import {SERVER_CONFIG} from '../server.config';

@Injectable({providedIn: 'root'})
export class GraphService {
  private graphUrl = SERVER_CONFIG.base_url + '/graph';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private graphMapper: GraphMapper) {
  }

  getGraph(): Observable<GraphModel> {
    return this.http.get<GraphJsonModel>(this.graphUrl, this.httpOptions)
      .pipe(
        map((graph) => this.graphMapper.mapJsonToGraphModel(graph))
      );
  }
}
