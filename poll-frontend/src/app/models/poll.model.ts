export type PollOption ={
  pollOptionID: number;
  text: string;
  voteCount: number;
}

export type Poll ={
  pollID: number;
  question: string;
  pollOption: PollOption[];
}