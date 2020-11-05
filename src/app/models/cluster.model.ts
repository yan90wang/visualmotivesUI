import {ClusterJsonModel} from './clusterJson.model';
import {Injectable} from '@angular/core';

export class ClusterModel {
  id: string;
  leader: number[];
  edges: string[];
  leaderUrl: string;
  size: number;
  x: number;
  y: number;

  constructor(
    id: string,
    leader: number[],
    edges: string[],
    leaderUrl: string,
    size: number,
    x: number,
    y: number
  ) {
    this.id = id;
    this.leader = leader;
    this.edges = edges;
    this.leaderUrl = leaderUrl;
    this.size = size;
    this.x = x;
    this.y = y;
  }
}

@Injectable({providedIn: 'root'})
export class ClusterMapper {
  mapJsonToClusterModel(cluster: ClusterJsonModel): ClusterModel {
    return new ClusterModel(cluster._id, cluster.leader, cluster.edges, cluster.leader_url, cluster.size, cluster.x, cluster.y);
  }
}
