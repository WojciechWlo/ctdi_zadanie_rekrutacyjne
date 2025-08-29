using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PollBackend.Hubs;
using PollBackend.Models;
using PollBackend.Stores;

[ApiController]
[Route("api/[controller]")] 
public class PollController : ControllerBase
{
    [HttpGet("{id}")]
    public ActionResult<Poll> GetPoll(int id)
    {
        var poll = PollStore.Polls.FirstOrDefault(p => p.PollID == id);
        if (poll == null)
            return NotFound();

        return Ok(poll);
    }

    [HttpPost("")]
    public ActionResult<int> CreatePoll([FromBody] JsonElement data)
    {
        if (!data.TryGetProperty("Question", out var questionProp) || string.IsNullOrWhiteSpace(questionProp.GetString()))
            return BadRequest("Question is required");

        if (!data.TryGetProperty("PollOption", out var optionsProp) || optionsProp.ValueKind != JsonValueKind.Array)
            return BadRequest("Options are required");

        var question = questionProp.GetString()!;
        var options = optionsProp.EnumerateArray().Select(x => x.GetString()!).ToArray();

        var poll = new Poll
        {
            Question = question,
            PollOption = options.Select(o => new PollOption { Text = o }).ToList()
        };

        PollStore.AddPoll(poll);

        return Ok(poll.PollID);      
    }

    [HttpPost("vote/{optionId}")]
    public async Task<ActionResult<PollOption>> VoteCountUpdate(int optionId, [FromServices] IHubContext<PollHub> hubContext)
    {
        var pollOption = PollStore.Polls.SelectMany(p => p.PollOption).FirstOrDefault(o => o.PollOptionID == optionId);

        if (pollOption == null)
            return NotFound();

        pollOption.VoteCount++;

        await hubContext.Clients.All.SendAsync(
            "ReceiveVoteUpdate",
            pollOption
        );

        return Ok(pollOption);
    }
}
