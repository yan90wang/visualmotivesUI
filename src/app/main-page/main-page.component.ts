import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  graphToggled = true;
  title = 'Detecting Visual Motives of 2019 Swiss Election';

  ngOnInit(): void {
  }

  toggleView() {
    this.graphToggled = !this.graphToggled;
  }
}
