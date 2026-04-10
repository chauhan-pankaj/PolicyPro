namespace NexSure.Security
{
    /// <summary>
    /// Audit logging service for tracking security-relevant events
    /// </summary>
    public class AuditLogger : IAuditLogger
    {
        private readonly ILogger<AuditLogger> _logger;
        private readonly string _auditLogPath;

        public AuditLogger(ILogger<AuditLogger> logger, IConfiguration configuration)
        {
            _logger = logger;
            _auditLogPath = configuration.GetValue<string>("Logging:AuditLogPath") ?? "logs/audit.log";
        }

        public async Task LogAccessAsync(string action, string userId, string ipAddress, bool success, string details = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                EventType = "ACCESS",
                Action = action,
                UserId = userId,
                IpAddress = ipAddress,
                Success = success,
                Details = details
            };

            await WriteAuditLogAsync(logEntry);
            _logger.LogInformation("Access logged: {Action} by {UserId} from {IpAddress}", action, userId, ipAddress);
        }

        public async Task LogDataAccessAsync(string dataType, string userId, string action, string details = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                EventType = "DATA_ACCESS",
                DataType = dataType,
                UserId = userId,
                Action = action,
                Details = details
            };

            await WriteAuditLogAsync(logEntry);
            _logger.LogInformation("Data access logged: {DataType} - {Action} by {UserId}", dataType, action, userId);
        }

        public async Task LogAuthenticationAttemptAsync(string username, bool success, string ipAddress)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                EventType = "AUTHENTICATION",
                Username = username,
                Success = success,
                IpAddress = ipAddress
            };

            await WriteAuditLogAsync(logEntry);
            _logger.LogWarning("Authentication attempt: {Username} from {IpAddress} - {Status}", 
                username, ipAddress, success ? "SUCCESS" : "FAILED");
        }

        public async Task LogErrorAsync(string errorType, string details, string userId = null)
        {
            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                EventType = "ERROR",
                ErrorType = errorType,
                UserId = userId,
                Details = details
            };

            await WriteAuditLogAsync(logEntry);
            _logger.LogError("Security error logged: {ErrorType} - {Details}", errorType, details);
        }

        private async Task WriteAuditLogAsync(object logEntry)
        {
            try
            {
                var directory = Path.GetDirectoryName(_auditLogPath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var json = System.Text.Json.JsonSerializer.Serialize(logEntry);
                await File.AppendAllTextAsync(_auditLogPath, json + Environment.NewLine);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to write audit log");
            }
        }
    }
}
