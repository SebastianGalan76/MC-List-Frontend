import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { PlayerCountStatistic } from '../../../../../../model/server/server';
import gradientPlugin from 'chartjs-plugin-gradient';

Chart.register(gradientPlugin);

const verticalLinerPlugin = {
  id: 'verticalLiner',
  afterInit: (chart: any, args: any, opts: any) => {
    chart.verticalLiner = {};
  },
  afterEvent: (chart: any, args: any, options: any) => {
    const { inChartArea } = args;
    chart.verticalLiner = { draw: inChartArea };
  },
  beforeTooltipDraw: (chart: any, args: any, options: any) => {
    const { draw } = chart.verticalLiner;
    if (!draw) return;

    const { ctx } = chart;
    const { top, bottom } = chart.chartArea;
    const { tooltip } = args;
    const x = tooltip?.caretX;
    if (!x) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.restore();
  },
};

Chart.register(verticalLinerPlugin);

@Component({
  selector: 'app-statistics-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('canvasChart') canvas!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) header!: String;
  @Input({ required: true }) data!: PlayerCountStatistic[];
  @Input() beginAtZero: boolean = true;
  @Input() labelsWithDay: boolean = false;

  ngAfterViewInit(): void {
    var labels;

    if (this.labelsWithDay) {
      labels = this.data.map(function (entry) {
        var date = new Date(entry.time);

        var time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);

        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var formattedDate = day + '.' + month + '.' + year;

        return formattedDate + ' ' + time;
      });
    }
    else {
      labels = this.data.map(function (entry) {

        var date = new Date(entry.time);
        return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
      });
    }

    var playerCounts = this.data.map(function (entry) {
      return entry.playerCount;
    });

    var minPlayerCount = Math.min(...playerCounts);

    var yConfig;

    if (this.beginAtZero || minPlayerCount < 10) {
      yConfig = {
        beginAtZero: true,
        ticks: {
          color: '#ffffff80'
        }
      };
    }
    else {
      yConfig = {
        min: minPlayerCount - 10,
        ticks: {
          color: '#ffffff80'
        }
      };
    }

    new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Online',
          data: playerCounts,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(0,0,0,0.0)',
          borderWidth: 1,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          gradient: {
            backgroundColor: {
              axis: 'y',
              colors: {
                0: 'rgba(226,162,88,1)',
                100: 'rgba(236,196,103,1)'
              }
            }
          }
        }]
      },
      options: {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff80'
            }
          },
          y: yConfig
        },
        plugins: {
          legend: {
            display: false
          }
        },
        animation: {
          duration: 0
        },
      },
    });
  }
}
