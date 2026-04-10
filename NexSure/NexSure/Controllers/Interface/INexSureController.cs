using NexSure.Model;

namespace NexSure.Controllers.Interface
{
    public interface INexSureController
    {
        Task<HealthQuoteResponse> GetHealthQuotesAsync(HealthQuoteRequest request);
    }
}
