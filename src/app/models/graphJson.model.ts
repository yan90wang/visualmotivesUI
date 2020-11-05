import {Links, Nodes} from './graph.model';

export interface GraphJsonModel {
  type?: string;
  data: GraphDataJsonModel;
  nodes: Nodes[];
  links: Links[];
}

export interface GraphDataJsonModel {
  nodes: Nodes[];
  links: Links[];
}
