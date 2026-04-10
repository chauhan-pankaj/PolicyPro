namespace NexSure.Security
{
    /// <summary>
    /// Interface for audit logging of security-relevant events
    /// </summary>
    public interface IAuditLogger
    {
        Task LogAccessAsync(string action, string userId, string ipAddress, bool success, string details = null);
        Task LogDataAccessAsync(string dataType, string userId, string action, string details = null);
        Task LogAuthenticationAttemptAsync(string username, bool success, string ipAddress);
        Task LogErrorAsync(string errorType, string details, string userId = null);
    }
}
