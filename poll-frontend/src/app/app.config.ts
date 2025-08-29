import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { PollCreateComponent } from './poll-create/poll-create.component';
import { PollVoteComponent } from './poll-vote/poll-vote.component';
import { PollResultsComponent } from './poll-results/poll-results.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(HttpClientModule),
    provideRouter(
      [
        {path: "", component: PollCreateComponent},
        {path: "poll/vote/:id", component: PollVoteComponent},
        {path: "poll/results/:id", component: PollResultsComponent}
      ],
      withComponentInputBinding()
    ),
  ]
};
