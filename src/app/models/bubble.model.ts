export interface Bubbles {
  data: number[];
}

export class BubbleChartModel {
  series: Bubbles[];

  constructor(
    bubbles: Bubbles[],
  ) {
    this.series = bubbles;
  }
}
