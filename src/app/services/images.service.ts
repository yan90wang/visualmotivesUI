import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {ImageMapper, ImageModel} from '../models/image.model';
import {ImageJsonModel} from '../models/imagesJsonModel';
import {SERVER_CONFIG} from '../server.config';

@Injectable({providedIn: 'root'})
export class ImagesService {
  private imagesUrl = SERVER_CONFIG.base_url + '/images';
  private imagesFromClusterUrl = SERVER_CONFIG.base_url + '/imagesFromCluster';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private imageMapper: ImageMapper) {
  }

  getAll(): Observable<ImageModel[]> {
    return this.http.get<ImageJsonModel[]>(this.imagesUrl, this.httpOptions)
      .pipe(
        map((images) => images.map((image) => this.imageMapper.mapJsonToImageModel(image))));
  }

  getImages(id: string | number): Observable<ImageModel[]> {
    let params = new HttpParams();
    if (typeof id === 'string') {
      params = new HttpParams().set('id', id);
    }
    return this.http.get<ImageJsonModel[]>(this.imagesFromClusterUrl, {params})
      .pipe(
        map((images) => images.map((image) => this.imageMapper.mapJsonToImageModel(image))));
  }
}
