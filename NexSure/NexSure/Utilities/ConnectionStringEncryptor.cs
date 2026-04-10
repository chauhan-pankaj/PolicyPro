namespace NexSure.Utilities
{
    /// <summary>
    /// Utility for encrypting connection strings for appsettings.json
    /// Run this once during setup to encrypt your plain text connection string
    /// </summary>
    public static class ConnectionStringEncryptor
    {
        /// <summary>
        /// Encrypts a plain text connection string
        /// Usage: var encrypted = ConnectionStringEncryptor.Encrypt(plainConnectionString, encryptionKey);
        /// Then copy the result to appsettings.json ConnectionStrings:DefaultConnection
        /// </summary>
        public static string Encrypt(string plainConnectionString, string encryptionKey)
        {
            if (string.IsNullOrEmpty(plainConnectionString))
                throw new ArgumentException("Connection string cannot be empty");

            if (string.IsNullOrEmpty(encryptionKey) || encryptionKey.Length < 32)
                throw new ArgumentException("Encryption key must be at least 32 characters");

            var encryptionService = new Security.EncryptionService(encryptionKey);
            return encryptionService.Encrypt(plainConnectionString);
        }

        /// <summary>
        /// Decrypts an encrypted connection string (for testing/debugging)
        /// </summary>
        public static string Decrypt(string encryptedConnectionString, string encryptionKey)
        {
            if (string.IsNullOrEmpty(encryptedConnectionString))
                throw new ArgumentException("Encrypted connection string cannot be empty");

            if (string.IsNullOrEmpty(encryptionKey) || encryptionKey.Length < 32)
                throw new ArgumentException("Encryption key must be at least 32 characters");

            var encryptionService = new Security.EncryptionService(encryptionKey);
            return encryptionService.Decrypt(encryptedConnectionString);
        }
    }
}
