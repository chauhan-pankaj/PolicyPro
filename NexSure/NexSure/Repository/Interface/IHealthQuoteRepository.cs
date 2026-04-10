using NexSure.Model;

namespace NexSure.Repository.Interface
{
    public interface IHealthQuoteRepository
    {
        Task<List<Plan>> GetPlansAsync(HealthQuoteRequest request);
        Task<decimal> CalculatePremiumAsync(HealthQuoteRequest request, decimal multiplier);
    }
}
