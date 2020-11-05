import {Injectable} from '@angular/core';
import {GraphJsonModel} from './graphJson.model';

/**
 * A Graph model for representing the clusters. Each cluster is a node and a link exists
 * between nodes if the distance is below a certain threshold.
 */

export interface Nodes {
  /* Cluster id */
  id: string;
  /* Image url of Leader */
  label: string;
  /* Cluster size */
  size: number;
  /* Marked true means it is connected through edges to another cluster */
  marked: boolean;
  /* Array with [x,y] 2d position */
  xy: string;
  /* Number of group cluster belongs to */
  group: number;
  /* Authors name of the cluster leader image */
  author: string;
  /* Authors id of the cluster leader image */
  authorId: string;
  /* Time when the cluster leader image was posted first */
  timestamp: string;
  /* ID of the original tweet */
  tweetLink: string;
}

export interface Links {
  id: string;
  source: string;
  target: string;
}

export class GraphModel {
  nodes: Nodes[];
  links: Links[];
  type?: string;

  constructor(
    nodes: Nodes[],
    links: Links[],
    type?: string
  ) {
    this.nodes = nodes;
    this.links = links;
    this.type = type;
  }
}

@Injectable({providedIn: 'root'})
export class GraphMapper {
  mapJsonToGraphModel(graph: GraphJsonModel): GraphModel {
    return new GraphModel(graph.data.nodes, graph.data.links, graph.type);
  }

  filterSize(graph: GraphModel, size: number, hasEdges: boolean): GraphModel {
    let filteredNodes = graph.nodes.filter(node => (node.size >= size) || node.marked);
    if (!hasEdges) {
      filteredNodes = graph.nodes.filter(node => (node.size >= size));
    }
    return new GraphModel(filteredNodes, graph.links);
  }
}
