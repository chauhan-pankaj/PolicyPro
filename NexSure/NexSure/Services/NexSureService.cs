using NexSure.Controllers.Interface;
using NexSure.Model;
using NexSure.Repository.Interface;
using NexSure.Security;

namespace NexSure.Services
{
    public class NexSureService : INexSureController
    {
        private readonly IHealthQuoteRepository _repository;
        private readonly IValidationService _validationService;
        private readonly IAuditLogger _auditLogger;
        private readonly ILogger<NexSureService> _logger;

        public NexSureService(
            IHealthQuoteRepository repository,
            IValidationService validationService,
            IAuditLogger auditLogger,
            ILogger<NexSureService> logger)
        {
            _repository = repository;
            _validationService = validationService;
            _auditLogger = auditLogger;
            _logger = logger;
        }

        public async Task<HealthQuoteResponse> GetHealthQuotesAsync(HealthQuoteRequest request)
        {
            try
            {
                // Validate request
                if (request.Members == null || request.Members.Count == 0)
                {
                    throw new ArgumentException("Invalid input: Members list cannot be empty");
                }

                if (!_validationService.ValidateSumInsured(request.SumInsured))
                {
                    throw new ArgumentException($"Invalid input: SumInsured must be between 100,000 and 10,000,000");
                }

                // Validate each member
                foreach (var member in request.Members)
                {
                    if (!_validationService.ValidateAge(member.Age))
                    {
                        throw new ArgumentException($"Invalid input: Member age must be between 18 and 100");
                    }

                    if (string.IsNullOrWhiteSpace(member.Relation))
                    {
                        throw new ArgumentException("Invalid input: Member relation is required");
                    }
                }

                var plans = await _repository.GetPlansAsync(request);

                // Log successful access
                await _auditLogger.LogAccessAsync(
                    "GetHealthQuotes",
                    "System",
                    "0.0.0.0",
                    true,
                    $"Generated quotes for {request.Members.Count} members");

                return new HealthQuoteResponse
                {
                    InsurerName = "NexSure",
                    Plans = plans
                };
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation failed for health quotes request");
                await _auditLogger.LogErrorAsync("VALIDATION_ERROR", ex.Message, "System");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing health quotes request");
                await _auditLogger.LogErrorAsync("PROCESSING_ERROR", ex.Message, "System");
                throw;
            }
        }
    }
}
