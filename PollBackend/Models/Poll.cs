namespace PollBackend.Models
{
    public class Poll
    {
        public int PollID { get; set; } 
        public string Question { get; set; } = string.Empty;   
        public List<PollOption> PollOption { get; set; } = new();   
    }
}