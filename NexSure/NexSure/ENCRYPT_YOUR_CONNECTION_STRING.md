# Encrypting Your Connection String - Step by Step

## Your Connection String
```
Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;
```

## Your Encryption Key (from appsettings.json)
```
CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION
```

## Step 1: Run the Encryption Helper

### Option A: Run in Terminal
```powershell
cd D:\SecurePolicySystem\PolicyPro\NexSure
dotnet run --project EncryptConnectionStringHelper.cs
```

### Option B: Create a Test Method in Visual Studio
1. Create a new xUnit test in your project
2. Add this code:

```csharp
using NexSure.Security;
using Xunit;

public class ConnectionStringEncryptionTests
{
    [Fact]
    public void EncryptConnectionString()
    {
        // Arrange
        string plainConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;";
        string encryptionKey = "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION";
        
        var encryptionService = new EncryptionService(encryptionKey);
        
        // Act
        string encrypted = encryptionService.Encrypt(plainConnectionString);
        
        // Assert
        Assert.NotEmpty(encrypted);
        
        // Display encrypted string in test output
        System.Diagnostics.Debug.WriteLine($"Encrypted: {encrypted}");
    }
}
```

3. Run the test and copy the encrypted string from the Debug output window

### Option C: Use PowerShell Script (Recommended)

```powershell
# Navigate to scripts folder
cd D:\SecurePolicySystem\PolicyPro\NexSure\Scripts

# Run the encryption script with your connection string and key
.\Encrypt-ConnectionString.ps1 `
  -ConnectionString "Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;" `
  -EncryptionKey "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION"
```

## Step 2: Copy the Encrypted String

The encrypted string will be displayed in the console/Debug window and automatically copied to clipboard.

Example (your actual result will be different):
```
AgEA0QAAAABVwBXd...VeryLongBase64StringHere...
```

## Step 3: Update appsettings.json

Replace the `DefaultConnection` value:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "[PASTE_ENCRYPTED_STRING_HERE]"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    },
    "AuditLogPath": "logs/audit.log"
  },
  "AllowedHosts": "*",
  "Security": {
    "EncryptionKey": "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION",
    "ApiKey": "CHANGE_ME_TO_UNIQUE_API_KEY_IN_PRODUCTION",
    "IsConnectionStringEncrypted": true
  }
}
```

## Step 4: Verify it Works

Create a quick test to verify decryption:

```csharp
[Fact]
public void VerifyConnectionStringDecryption()
{
    // Arrange
    string encryptedConnectionString = "[YOUR_ENCRYPTED_STRING]";
    string encryptionKey = "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION";
    string expectedConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;";
    
    var encryptionService = new EncryptionService(encryptionKey);
    
    // Act
    string decrypted = encryptionService.Decrypt(encryptedConnectionString);
    
    // Assert
    Assert.Equal(expectedConnectionString, decrypted);
}
```

## Architecture Overview

```
Your Connection String (Plain Text)
    ↓
[Encryption Service - AES-256-CBC]
    ↓
Encrypted String (Base64)
    ↓
appsettings.json
    ↓
[Application Startup]
    ↓
ConnectionStringProvider
    ↓
IConnectionStringProvider (Injected)
    ↓
Your Repository
    ↓
SqlConnection (Decrypted)
```

## Security Checklist

- [ ] Connection string encrypted and placed in appsettings.json
- [ ] Encryption key is at least 32 characters
- [ ] Encryption key set in appsettings.json or environment variable
- [ ] `IsConnectionStringEncrypted` set to `true`
- [ ] Verified decryption works with test
- [ ] Never commit plain encryption key to Git
- [ ] Use environment variables in production
- [ ] Do NOT commit appsettings.json with real encryption key to Git

## Environment Variables (Production)

### Windows PowerShell
```powershell
[Environment]::SetEnvironmentVariable("Security__EncryptionKey", "YOUR_PRODUCTION_KEY_HERE", "User")
```

### Linux/Mac
```bash
export Security__EncryptionKey="YOUR_PRODUCTION_KEY_HERE"
```

### Azure App Service
1. Go to Configuration → Application settings
2. Add new setting:
   - Name: `Security:EncryptionKey`
   - Value: `YOUR_PRODUCTION_KEY_HERE`
3. Add new setting:
   - Name: `Security:ApiKey`
   - Value: `YOUR_PRODUCTION_API_KEY_HERE`

## Troubleshooting

**Q: My encrypted string doesn't work**
- Verify the encryption key matches exactly (check for spaces)
- Ensure key is at least 32 characters
- Try re-encrypting with the same key

**Q: Connection fails after decryption**
- Verify original connection string connects to database
- Check SQL Server (localdb) is running: `sqllocaldb.exe info`
- Test with a connection string tester tool

**Q: Can't run PowerShell script**
- Check execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Or use Option B (Test method) instead

## Files Involved

```
NexSure/
├── appsettings.json                          ← UPDATE THIS
├── EncryptConnectionStringHelper.cs          ← RUN THIS (if using .NET CLI)
├── Scripts/
│   └── Encrypt-ConnectionString.ps1          ← RUN THIS (PowerShell)
└── Security/
    ├── EncryptionService.cs
    ├── ConnectionStringProvider.cs
    └── IConnectionStringProvider.cs
```

## Next: Using in Your Repository

Once encrypted, inject `IConnectionStringProvider` into your repositories:

```csharp
public class HealthQuoteRepository : IHealthQuoteRepository
{
    private readonly IConnectionStringProvider _connectionStringProvider;
    
    public HealthQuoteRepository(IConnectionStringProvider connectionStringProvider)
    {
        _connectionStringProvider = connectionStringProvider;
    }
    
    public async Task<List<Plan>> GetPlansAsync(HealthQuoteRequest request)
    {
        // Get decrypted connection string
        string connectionString = _connectionStringProvider.GetConnectionString();
        
        using (var connection = new SqlConnection(connectionString))
        {
            await connection.OpenAsync();
            // Your database operations here
        }
    }
}
```

---

**Ready to encrypt? Start with Option C (PowerShell) - it's the easiest!**
