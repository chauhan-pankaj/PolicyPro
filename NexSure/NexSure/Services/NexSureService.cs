using NexSure.Controllers.Interface;
using NexSure.Model;
using NexSure.Repository.Interface;

namespace NexSure.Services
{
    public class NexSureService : INexSureController
    {
        private readonly IHealthQuoteRepository _repository;

        public NexSureService(IHealthQuoteRepository repository)
        {
            _repository = repository;
        }

        public async Task<HealthQuoteResponse> GetHealthQuotesAsync(HealthQuoteRequest request)
        {
            if (request.Age <= 0 || request.SumInsured <= 0)
            {
                throw new ArgumentException("Invalid input: Age and SumInsured must be greater than 0");
            }

            var plans = await _repository.GetPlansAsync(request);

            return new HealthQuoteResponse
            {
                InsurerName = "NexSure",
                Plans = plans
            };
        }
    }
}
