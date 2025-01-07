import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() chartConfig!: ChartConfiguration;

  ngOnInit(): void {
    Chart.register(...registerables);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    new Chart(canvas, this.chartConfig);
  }
}
