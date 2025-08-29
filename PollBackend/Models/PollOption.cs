namespace PollBackend.Models
{
    public class PollOption
    {
        public int PollOptionID { get; set; }  
        public string Text { get; set; } = string.Empty;   
        public int VoteCount { get; set; } = 0;   
    }
}