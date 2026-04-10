# Encrypted Connection String Setup Guide

## Overview
This guide explains how to encrypt your database connection string for security.

## Step 1: Generate Encrypted Connection String

### Option A: Using PowerShell Script (Recommended)

```powershell
cd NexSure\Scripts
.\Encrypt-ConnectionString.ps1 `
  -ConnectionString "Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True" `
  -EncryptionKey "YOUR_32_CHARACTER_ENCRYPTION_KEY_HERE"
```

The encrypted string will be copied to your clipboard and displayed in the console.

### Option B: Using C# Code

In your application startup or a test method:

```csharp
using NexSure.Utilities;

// Encrypt your connection string
string plainConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";
string encryptionKey = "YOUR_32_CHARACTER_ENCRYPTION_KEY_HERE";

string encrypted = ConnectionStringEncryptor.Encrypt(plainConnectionString, encryptionKey);
Console.WriteLine(encrypted);
// Copy output and paste into appsettings.json
```

## Step 2: Add Encrypted String to appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_ENCRYPTED_STRING_HERE"
  },
  "Security": {
    "EncryptionKey": "YOUR_32_CHARACTER_ENCRYPTION_KEY_HERE",
    "IsConnectionStringEncrypted": true
  }
}
```

## Step 3: Use in Your Application

The `IConnectionStringProvider` service automatically decrypts the connection string when needed.

### In Repository or Data Access Layer:

```csharp
public class YourRepository
{
    private readonly IConnectionStringProvider _connectionStringProvider;

    public YourRepository(IConnectionStringProvider connectionStringProvider)
    {
        _connectionStringProvider = connectionStringProvider;
    }

    public async Task<Data> GetDataAsync()
    {
        string connectionString = _connectionStringProvider.GetConnectionString("DefaultConnection");
        
        using (var connection = new SqlConnection(connectionString))
        {
            // Use the connection
            await connection.OpenAsync();
            // ... your code
        }
    }
}
```

## Security Best Practices

1. **Encryption Key Management**
   - Never commit encryption key to source control
   - Use environment variables for encryption key
   - Rotate keys periodically
   - Minimum 32 characters for AES-256

2. **Production Setup**
   ```bash
   # Set environment variable
   $env:NEXSURE_ENCRYPTION_KEY = "YOUR_SECURE_32_CHAR_KEY"
   ```

3. **Configuration Priority**
   - Environment variables override appsettings.json
   - Use Azure Key Vault for cloud deployments
   - Use User Secrets for development

4. **Connection String Security**
   - Never log decrypted connection strings
   - Always use HTTPS in production
   - Use integrated authentication when possible
   - Encrypt credentials in connection string

## Testing Decryption

To verify encrypted connection string works:

```csharp
using NexSure.Utilities;

// Decrypt for testing only
string encrypted = "YOUR_ENCRYPTED_STRING_FROM_APPSETTINGS";
string encryptionKey = "YOUR_32_CHARACTER_ENCRYPTION_KEY_HERE";

string decrypted = ConnectionStringEncryptor.Decrypt(encrypted, encryptionKey);
Console.WriteLine(decrypted);
// Should match your original connection string
```

## Troubleshooting

### "Encryption key must be at least 32 characters"
- Ensure your EncryptionKey in appsettings.json is at least 32 characters long
- Generate a stronger key if needed

### "Failed to decrypt connection string"
- Verify the encryption key matches the one used to encrypt
- Check that the encrypted string hasn't been corrupted
- Ensure IsConnectionStringEncrypted is set to true

### Connection fails after encryption
- Verify the decrypted string is identical to original
- Check database connectivity with decrypted string
- Ensure SQL Server instance is running

## Environment Variable Setup

### Windows (PowerShell)
```powershell
[Environment]::SetEnvironmentVariable("NEXSURE_ENCRYPTION_KEY", "your-32-char-key", "User")
```

### Linux/Mac (Bash)
```bash
export NEXSURE_ENCRYPTION_KEY="your-32-char-key"
```

### Azure App Service
Set in Configuration > Application settings:
- Name: `Security:EncryptionKey`
- Value: `your-32-char-key`

## Performance Considerations

- Decrypted connection strings are cached in memory per service instance
- Minimal performance impact after initial decryption
- Cache is application-scoped and cleared on app restart

## Additional Resources

- AES-256-CBC Encryption: https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.aes
- PBKDF2 Key Derivation: https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.rfc2898derivebytes
- Azure Key Vault: https://docs.microsoft.com/en-us/azure/key-vault/
