import {Injectable} from '@angular/core';
import {ImageJsonModel} from './imagesJsonModel';
import {SERVER_CONFIG} from '../server.config';

export class ImageModel {
  id: string;
  hash: number[];
  clusterId: string;
  url: string;
  author: string;
  timestamp: string;
  tweetId: string;

  constructor(
    id: string,
    hash: number[],
    clusterId: string,
    url: string,
    author: string,
    timestamp: string,
    tweetId: string
  ) {
    this.id = id;
    this.hash = hash;
    this.clusterId = clusterId;
    this.url = url;
    this.author = author;
    this.timestamp = timestamp;
    this.tweetId = tweetId;
  }
}

@Injectable({providedIn: 'root'})
export class ImageMapper {
  private dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  mapJsonToImageModel(image: ImageJsonModel): ImageModel {
    return new ImageModel(image._id, image.hash, image.clusterId, image.url, image.author, image.timestamp, image.tweetId);
  }

  mapImageUrl(images: ImageModel[]) {
    return images.map(img => {
      const encoded = encodeURIComponent(img.url);
      img.url = SERVER_CONFIG.pythia_image_retrieval + encoded;
      return img;
    });
  }

  mapSingleUrl(url: string) {
    const encoded = encodeURIComponent(url);
    return SERVER_CONFIG.pythia_image_retrieval + encoded;
  }

  mapUnixTimestamp(timestamp: string) {
    const time = parseInt(timestamp, 10);
    return (new Date(time)).toLocaleDateString('en-EN', this.dateOptions);
  }

  mapTweetLink(tweetId: string) {
    return 'https://twitter.com/user/status/' + tweetId.replace(/\D/g, '');
  }
}
