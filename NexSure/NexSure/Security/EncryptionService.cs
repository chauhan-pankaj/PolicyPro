using System.Security.Cryptography;
using System.Text;

namespace NexSure.Security
{
    /// <summary>
    /// Encryption service using AES-256-CBC encryption and PBKDF2 for password hashing
    /// Implementation based on industry-standard secure encryption practices
    /// </summary>
    public class EncryptionService : IEncryptionService
    {
        private readonly string _encryptionKey;
        private readonly int _keySize = 256;
        private readonly int _blockSize = 128;
        private readonly int _iterations = 100000;
        private const int SaltLength = 16;

        public EncryptionService(string encryptionKey)
        {
            if (string.IsNullOrWhiteSpace(encryptionKey) || encryptionKey.Length < 32)
                throw new ArgumentException("Encryption key must be at least 32 characters long");

            _encryptionKey = encryptionKey;
        }

        /// <summary>
        /// Encrypts plain text using AES-256-CBC with PBKDF2 derived key
        /// </summary>
        public string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                return plainText;

            try
            {
                byte[] salt = GenerateRandomBytes(SaltLength);

                using (var aes = Aes.Create())
                {
                    aes.KeySize = _keySize;
                    aes.BlockSize = _blockSize;
                    aes.Mode = CipherMode.CBC;
                    aes.Padding = PaddingMode.PKCS7;

                    // Derive key from master encryption key and unique salt
                    byte[] derivedKey = DeriveKey(salt);
                    aes.Key = derivedKey;

                    // Generate random IV
                    aes.GenerateIV();

                    using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                    using (var ms = new MemoryStream())
                    {
                        // Prepend salt and IV for decryption later
                        ms.Write(salt, 0, salt.Length);
                        ms.Write(aes.IV, 0, aes.IV.Length);

                        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        using (var sw = new StreamWriter(cs))
                        {
                            sw.Write(plainText);
                        }

                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Encryption failed", ex);
            }
        }

        /// <summary>
        /// Decrypts encrypted text that was encrypted with Encrypt method
        /// </summary>
        public string Decrypt(string encryptedText)
        {
            if (string.IsNullOrEmpty(encryptedText))
                return encryptedText;

            try
            {
                byte[] buffer = Convert.FromBase64String(encryptedText);
                int offset = 0;

                // Extract salt
                byte[] salt = new byte[SaltLength];
                Array.Copy(buffer, offset, salt, 0, SaltLength);
                offset += SaltLength;

                using (var aes = Aes.Create())
                {
                    aes.KeySize = _keySize;
                    aes.BlockSize = _blockSize;
                    aes.Mode = CipherMode.CBC;
                    aes.Padding = PaddingMode.PKCS7;

                    // Derive key using the same salt
                    byte[] derivedKey = DeriveKey(salt);
                    aes.Key = derivedKey;

                    // Extract IV
                    byte[] iv = new byte[aes.BlockSize / 8];
                    Array.Copy(buffer, offset, iv, 0, iv.Length);
                    offset += iv.Length;
                    aes.IV = iv;

                    using (var decryptor = aes.CreateDecryptor(aes.Key, aes.IV))
                    using (var ms = new MemoryStream(buffer, offset, buffer.Length - offset))
                    using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    using (var sr = new StreamReader(cs))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Decryption failed", ex);
            }
        }

        /// <summary>
        /// Hashes password using PBKDF2-HMAC-SHA256 with salt
        /// </summary>
        public string Hash(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            try
            {
                byte[] salt = GenerateRandomBytes(SaltLength);

                using (var pbkdf2 = new Rfc2898DeriveBytes(input, salt, _iterations, HashAlgorithmName.SHA256))
                {
                    byte[] hash = pbkdf2.GetBytes(32);

                    // Return salt + hash combined
                    byte[] result = new byte[salt.Length + hash.Length];
                    Array.Copy(salt, 0, result, 0, salt.Length);
                    Array.Copy(hash, 0, result, salt.Length, hash.Length);

                    return Convert.ToBase64String(result);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Hashing failed", ex);
            }
        }

        /// <summary>
        /// Verifies if input matches the stored hash (timing-attack resistant)
        /// </summary>
        public bool VerifyHash(string input, string hash)
        {
            if (string.IsNullOrEmpty(input) || string.IsNullOrEmpty(hash))
                return false;

            try
            {
                byte[] hashBytes = Convert.FromBase64String(hash);

                // Extract salt from hash
                byte[] salt = new byte[SaltLength];
                Array.Copy(hashBytes, 0, salt, 0, SaltLength);

                // Compute hash of input with extracted salt
                using (var pbkdf2 = new Rfc2898DeriveBytes(input, salt, _iterations, HashAlgorithmName.SHA256))
                {
                    byte[] computedHash = pbkdf2.GetBytes(32);

                    // Timing-attack resistant comparison
                    return ConstantTimeCompare(computedHash, 0, hashBytes, SaltLength, computedHash.Length);
                }
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Derives encryption key from master key and salt using PBKDF2
        /// </summary>
        private byte[] DeriveKey(byte[] salt)
        {
            using (var keyDerivation = new Rfc2898DeriveBytes(_encryptionKey, salt, _iterations, HashAlgorithmName.SHA256))
            {
                return keyDerivation.GetBytes(_keySize / 8);
            }
        }

        /// <summary>
        /// Generates cryptographically secure random bytes
        /// </summary>
        private static byte[] GenerateRandomBytes(int length)
        {
            byte[] randomBytes = new byte[length];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return randomBytes;
        }

        /// <summary>
        /// Constant-time comparison to prevent timing attacks
        /// </summary>
        private static bool ConstantTimeCompare(byte[] a, int aOffset, byte[] b, int bOffset, int length)
        {
            int result = 0;
            for (int i = 0; i < length; i++)
            {
                result |= a[aOffset + i] ^ b[bOffset + i];
            }
            return result == 0;
        }
    }
}
