import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GraphModel} from '../../models/graph.model';


@Component({
  selector: 'app-cluster-info-dialog',
  templateUrl: './cluster-info-dialog.component.html',
  styleUrls: ['./cluster-info-dialog.component.css']
})

export class ClusterInfoDialogComponent {
  maxSize = 0;
  pickedSize = 1;
  initValue = 0;

  constructor(public dialogRef: MatDialogRef<ClusterInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { graphData: GraphModel, initVal: number }) {
    this.findMaxSize(data);
    this.initValue = data.initVal;
  }

  closeDialog() {
    this.dialogRef.close(this.pickedSize);
  }

  private findMaxSize(data: { graphData: GraphModel }) {
    for (const node of data.graphData.nodes) {
      if (node.size > this.maxSize) {
        this.maxSize = node.size;
      }
    }
  }
}
