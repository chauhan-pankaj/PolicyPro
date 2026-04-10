using NexSure.Model;
using NexSure.Repository.Interface;

namespace NexSure.Repository
{
    public class HealthQuoteRepository : IHealthQuoteRepository
    {
        public async Task<List<Plan>> GetPlansAsync(HealthQuoteRequest request)
        {
            // Simulate async database or external service call
            return await Task.FromResult(new List<Plan>
            {
                new Plan
                {
                    PlanName = "Silver Plan",
                    SumInsured = request.SumInsured,
                    Premium = await CalculatePremiumAsync(request, 1.0m),
                    Features = "Basic coverage, Room rent limit"
                },
                new Plan
                {
                    PlanName = "Gold Plan",
                    SumInsured = request.SumInsured,
                    Premium = await CalculatePremiumAsync(request, 1.5m),
                    Features = "No room rent limit, Cashless hospitals"
                },
                new Plan
                {
                    PlanName = "Premium Plan",
                    SumInsured = request.SumInsured,
                    Premium = await CalculatePremiumAsync(request, 2.0m),
                    Features = "Unlimited coverage, OPD, Worldwide"
                }
            });
        }

        public async Task<decimal> CalculatePremiumAsync(HealthQuoteRequest request, decimal multiplier)
        {
            // Calculate average age from all members
            decimal averageAge = (decimal)request.Members.Average(m => m.Age);

            // Premium calculation logic based on average age and sum insured
            return await Task.FromResult((request.SumInsured * multiplier / 100000) * (1 + (averageAge / 100m)));
        }
    }
}
