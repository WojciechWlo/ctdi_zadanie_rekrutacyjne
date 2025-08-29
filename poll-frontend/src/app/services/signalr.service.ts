import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { PollOption } from '../models/poll.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private voteUpdates = new BehaviorSubject<PollOption | null>(null);

  voteUpdates$ = this.voteUpdates.asObservable();


  async startConnection(){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5100/pollhub', { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log('Connected with SignalR');
    } catch (err) {
      console.error('Error while connecting to SignalR:', err);
    }

    this.hubConnection.on('ReceiveVoteUpdate', (option: PollOption) => {
      this.voteUpdates.next(option);
    });
  }
}
