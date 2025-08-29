import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poll, PollOption } from '../models/poll.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:5100/api/poll';
  
  constructor(private http: HttpClient) { }

  getPoll(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiUrl}/${id}`);
  }

  createPoll(question: string, options: string[]): Observable<Poll> {
    const body = { Question: question, PollOption: options };
    return this.http.post<Poll>(this.apiUrl, body);
  }

  vote(optionId: number): Observable<PollOption> {
    return this.http.post<PollOption>(`${this.apiUrl}/vote/${optionId}`, {});
  }

}
