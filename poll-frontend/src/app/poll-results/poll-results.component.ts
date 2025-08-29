import { Component, ElementRef, Input, ViewChild} from '@angular/core';
import { Poll } from '../models/poll.model';
import { CommonModule } from '@angular/common';
import { SignalrService } from '../services/signalr.service';
import { Chart, ChartConfiguration, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { PollService } from '../services/poll.service';


Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-poll-results',
  imports: [CommonModule],
  templateUrl: './poll-results.component.html',
  styleUrl: './poll-results.component.css'
})
export class PollResultsComponent{
  @Input() id!: number;
  @ViewChild('pollChart', { static: false }) pollChartRef!: ElementRef<HTMLCanvasElement>;
  pollID!: number;
  poll!: Poll;
  chart!: Chart;

  constructor( private SignalrService: SignalrService, private pollService: PollService) {}

  ngOnInit() {
    this.pollID = this.id;
    this.pollService.getPoll(this.pollID)
      .subscribe({
        next: data => {
          this.poll = data;
          this.createChart();
        },
        error: err => console.error('Error:', err)
      });

    this.SignalrService.startConnection();

    this.SignalrService.voteUpdates$.subscribe(option => { 
      if(option && this.poll){
        const index = this.poll.pollOption.findIndex(o => o.pollOptionID === option.pollOptionID);
        if (index !== -1) {
          this.poll.pollOption[index] = option;
          this.updateChart();
        }
      }
    });
  }

  createChart() {
    const ctx = this.pollChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.poll) return;

    const optionCount = this.poll.pollOption.length;

    const backgroundColors = Array.from({ length: optionCount }, (_, i) => 
      `hsl(${(i * 360) / optionCount}, 70%, 60%)`
    );

    const borderColors = Array.from({ length: optionCount }, (_, i) => 
      `hsl(${(i * 360) / optionCount}, 70%, 40%)`
    );

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.poll.pollOption.map(o => o.text),
        datasets: [{
          data: this.poll.pollOption.map(o => o.voteCount),
          borderWidth: 1,
          backgroundColor: backgroundColors,
          borderColor: borderColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.poll.question,
            color: 'black',
            font: { size: 14, weight: 'bold' }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Options',
              color: 'black',
              font: { size: 14, weight: 'bold' }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Votes',
              color: 'black',
              font: { size: 14, weight: 'bold' }
            },
            ticks: {
              stepSize: 1,

            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, config);
  }

  updateChart() {
    console.log(this.chart, this.poll)
    if (!this.chart || !this.poll) return;
    
    this.chart.data.labels = this.poll.pollOption.map(o => o.text);
    this.chart.data.datasets[0].data = this.poll.pollOption.map(o => o.voteCount);
    this.chart.update();
  }

}
