using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NexSure.Model;
using System.Numerics;

namespace NexSure.Controllers
{
    [ApiController]
    [Route("api/nexsure/health")]
    public class NexSureController : ControllerBase
    {
        [HttpPost("quotes")]
        public IActionResult GetHealthQuotes([FromBody] HealthQuoteRequest request)
        {
            if (request.Age <= 0 || request.SumInsured <= 0)
            {
                return BadRequest("Invalid input");
            }

            var response = new HealthQuoteResponse
            {
                InsurerName = "NexSure",
                Plans = new List<Plan>
            {
                new Plan
                {
                    PlanName = "Silver Plan",
                    SumInsured = request.SumInsured,
                    Premium = CalculatePremium(request, 1.0m),
                    Features = "Basic coverage, Room rent limit"
                },
                new Plan
                {
                    PlanName = "Gold Plan",
                    SumInsured = request.SumInsured,
                    Premium = CalculatePremium(request, 1.5m),
                    Features = "No room rent limit, Cashless hospitals"
                },
                new Plan
                {
                    PlanName = "Premium Plan",
                    SumInsured = request.SumInsured,
                    Premium = CalculatePremium(request, 2.0m),
                    Features = "Unlimited coverage, OPD, Worldwide"
                }
            }
            };

            return Ok(response);
        }

        private decimal CalculatePremium(HealthQuoteRequest request, decimal multiplier)
        {
            decimal basePremium = request.SumInsured * 0.01m;

            if (request.Age > 40)
                basePremium *= 1.5m;

            return basePremium * multiplier;
        }
    }
}
