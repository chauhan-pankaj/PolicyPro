namespace NexSure.Security
{
    /// <summary>
    /// Service for providing encrypted connection strings
    /// Decrypts connection strings on demand
    /// </summary>
    public class ConnectionStringProvider : IConnectionStringProvider
    {
        private readonly IConfiguration _configuration;
        private readonly IEncryptionService _encryptionService;
        private readonly ILogger<ConnectionStringProvider> _logger;
        private readonly Dictionary<string, string> _decryptedCache;

        public ConnectionStringProvider(
            IConfiguration configuration,
            IEncryptionService encryptionService,
            ILogger<ConnectionStringProvider> logger)
        {
            _configuration = configuration;
            _encryptionService = encryptionService;
            _logger = logger;
            _decryptedCache = new Dictionary<string, string>();
        }

        /// <summary>
        /// Gets and decrypts the connection string
        /// Caches decrypted values for performance
        /// </summary>
        public string GetConnectionString(string name = "DefaultConnection")
        {
            try
            {
                // Check cache first
                if (_decryptedCache.ContainsKey(name))
                {
                    return _decryptedCache[name];
                }

                // Get encrypted connection string from configuration
                var encryptedConnectionString = _configuration.GetConnectionString(name);
                
                if (string.IsNullOrEmpty(encryptedConnectionString))
                {
                    throw new InvalidOperationException($"Connection string '{name}' not found in configuration");
                }

                // Decrypt the connection string
                string decryptedConnectionString = _encryptionService.Decrypt(encryptedConnectionString);

                // Cache the decrypted value
                _decryptedCache[name] = decryptedConnectionString;

                _logger.LogInformation("Connection string '{Name}' decrypted and retrieved", name);

                return decryptedConnectionString;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get connection string '{Name}'", name);
                throw new InvalidOperationException($"Failed to decrypt connection string '{name}'", ex);
            }
        }
    }
}
