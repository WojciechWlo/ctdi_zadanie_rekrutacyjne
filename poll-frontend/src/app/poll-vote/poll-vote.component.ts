import { Component, Input } from '@angular/core';
import { Poll } from '../models/poll.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PollService } from '../services/poll.service';

@Component({
  selector: 'app-poll-vote',
  imports: [CommonModule],
  templateUrl: './poll-vote.component.html',
  styleUrl: './poll-vote.component.css'
})
export class PollVoteComponent {
  @Input() id!: number;
  pollID!: number;

  poll!: Poll;

  constructor(private router: Router, private pollService: PollService) {}

  
  vote(optionID:number){
    this.pollService.vote(optionID)
      .subscribe({
        next: data => {
          this.router.navigate(['/poll/results/', this.pollID]);      
        },
        error: err => console.error('Error:', err)
      });
  }

  ngOnInit() {
    this.pollID = this.id;
    this.pollService.getPoll(this.pollID)
      .subscribe({
        next: data => {
          this.poll = data;
        },
        error: err => console.error('Error:', err)
      });
  }
}
