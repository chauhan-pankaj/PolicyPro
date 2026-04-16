using NexSure.Security;

namespace NexSure.Utilities
{
    /// <summary>
    /// Helper utility to encrypt connection strings
    /// Use this to generate encrypted connection strings for appsettings.json
    /// </summary>
    public static class EncryptConnectionStringHelper
    {
        /// <summary>
        /// Encrypts the NexSure connection string
        /// Call this method to get encrypted connection string
        /// </summary>
        public static string EncryptNexSureConnectionString()
        {
            // Your connection string
            string plainConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;";

            // Your encryption key from appsettings.json
            string encryptionKey = "NexSure@2026SecureKey#X9pL2mQ8vR4tZ";

            try
            {
                // Create encryption service
                var encryptionService = new EncryptionService(encryptionKey);

                // Encrypt the connection string
                string encryptedConnectionString = encryptionService.Encrypt(plainConnectionString);

                return encryptedConnectionString;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to encrypt connection string", ex);
            }
        }

        /// <summary>
        /// Displays encryption information (for testing/debugging)
        /// </summary>
        public static void DisplayEncryptionInfo()
        {
            try
            {
                string plainConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;";
                string encryptionKey = "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION";
                var encryptionService = new EncryptionService(encryptionKey);
                string encryptedConnectionString = encryptionService.Encrypt(plainConnectionString);

                Console.WriteLine("╔════════════════════════════════════════════════════════════════╗");
                Console.WriteLine("║          Connection String Encryption Complete                ║");
                Console.WriteLine("╚════════════════════════════════════════════════════════════════╝");
                Console.WriteLine();

                Console.WriteLine("📋 Original Connection String:");
                Console.WriteLine(plainConnectionString);
                Console.WriteLine();

                Console.WriteLine("🔐 Encrypted Connection String:");
                Console.WriteLine(encryptedConnectionString);
                Console.WriteLine();

                Console.WriteLine("✅ Copy the encrypted string above and paste it into appsettings.json");
                Console.WriteLine("   under: \"ConnectionStrings\" -> \"DefaultConnection\"");
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
            }
        }
    }
}
