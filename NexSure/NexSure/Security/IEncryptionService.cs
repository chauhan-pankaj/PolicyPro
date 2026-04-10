namespace NexSure.Security
{
    /// <summary>
    /// Interface for encryption/decryption services
    /// </summary>
    public interface IEncryptionService
    {
        /// <summary>
        /// Encrypts sensitive data
        /// </summary>
        string Encrypt(string plainText);

        /// <summary>
        /// Decrypts encrypted data
        /// </summary>
        string Decrypt(string encryptedText);

        /// <summary>
        /// Hashes sensitive data (one-way encryption)
        /// </summary>
        string Hash(string input);

        /// <summary>
        /// Verifies if input matches hash
        /// </summary>
        bool VerifyHash(string input, string hash);
    }
}
