using Microsoft.AspNetCore.SignalR;
using PollBackend.Models;

namespace PollBackend.Hubs
{
    public class PollHub : Hub
    {

        public async Task SendMessage(PollOption option)
        {
            await Clients.All.SendAsync("ReceiveVoteUpdate", option);
        }

    }
}