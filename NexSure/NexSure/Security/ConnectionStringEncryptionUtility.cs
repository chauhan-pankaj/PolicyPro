namespace NexSure.Security
{
    /// <summary>
    /// Utility for encrypting and decrypting connection strings
    /// </summary>
    public static class ConnectionStringEncryptionUtility
    {
        /// <summary>
        /// Encrypts a connection string using the provided encryption key
        /// </summary>
        public static string EncryptConnectionString(string connectionString, IEncryptionService encryptionService)
        {
            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentException("Connection string cannot be null or empty");

            return encryptionService.Encrypt(connectionString);
        }

        /// <summary>
        /// Decrypts a connection string using the provided encryption service
        /// </summary>
        public static string DecryptConnectionString(string encryptedConnectionString, IEncryptionService encryptionService)
        {
            if (string.IsNullOrEmpty(encryptedConnectionString))
                throw new ArgumentException("Encrypted connection string cannot be null or empty");

            return encryptionService.Decrypt(encryptedConnectionString);
        }
    }
}
