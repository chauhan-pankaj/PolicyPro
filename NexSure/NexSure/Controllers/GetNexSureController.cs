using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexSure.Controllers.Interface;
using NexSure.Model;

namespace NexSure.Controllers
{
    [ApiController]
    [Route("api/nexsure/health")]
    public class GetNexSureController : ControllerBase
    {
        private readonly INexSureController _nexSureService;

        public GetNexSureController(INexSureController nexSureService)
        {
            _nexSureService = nexSureService;
        }

        [HttpPost("quotes")]
        public async Task<IActionResult> GetHealthQuotes([FromBody] HealthQuoteRequest request)
        {
            try
            {
                var response = await _nexSureService.GetHealthQuotesAsync(request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
