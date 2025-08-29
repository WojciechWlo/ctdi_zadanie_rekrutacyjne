import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PollService } from '../services/poll.service';

@Component({
  selector: 'app-poll-create',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule
  ], 
  templateUrl: './poll-create.component.html',
  styleUrl: './poll-create.component.css'
})
export class PollCreateComponent {
  question: string ="";
  options: string[] = [""]

  constructor( private router: Router, private pollService: PollService) {}

  addOption(){
    this.options.push("")
  }

  removeOption(){
    this.options.pop()
  }

  trackByIndex(index: number) {
    return index;
  }

  createPoll(){
    this.pollService.createPoll(this.question, this.options)
      .subscribe({
        next: data => {
          this.router.navigate(['/poll/vote/', data]);
        },
        error: err => console.error('Error:', err)
      });
  }

}
