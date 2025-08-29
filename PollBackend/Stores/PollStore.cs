using PollBackend.Models;

namespace PollBackend.Stores
{
    public class PollStore
    {
        public static List<Poll> Polls { get; set; } = new();
        private static int _lastPollId = 0;
        private static int _lastOptionId = 0;

        public static Poll AddPoll(Poll poll)
        {
            poll.PollID = _lastPollId++;

            foreach (var option in poll.PollOption)
            {
                option.PollOptionID = _lastOptionId++;
            }

            Polls.Add(poll);
            return poll;
        }        
    }
}