import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {ClusterGraphComponent} from './cluster-graph/cluster-graph.component';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClusterInfoDialogComponent} from './cluster-graph/cluster-info-dialog/cluster-info-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSliderModule} from '@angular/material/slider';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MainPageComponent} from './main-page/main-page.component';
import {ClusterChartComponent} from './cluster-chart/cluster-chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    AppComponent,
    ClusterGraphComponent,
    ClusterInfoDialogComponent,
    MainPageComponent,
    ClusterChartComponent
  ],
  entryComponents: [ClusterInfoDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSliderModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    NgApexchartsModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: Window, useValue: window }],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
