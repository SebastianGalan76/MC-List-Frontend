import { Component } from '@angular/core';
import { ChartComponent } from "./chart/chart.component";
import { ServerComponent } from '../../server.component';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class ServerStatisticComponent {
  constructor(
    public parent: ServerComponent
  ) {}


}
