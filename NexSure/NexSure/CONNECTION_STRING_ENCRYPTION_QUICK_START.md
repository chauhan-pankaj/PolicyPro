# 🚀 Quick Guide: Encrypt Your Connection String

## Your Information
- **Connection String:** `Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;`
- **Encryption Key:** `CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION` (60 characters ✅)
- **Encryption Method:** AES-256-CBC with PBKDF2

---

## ⚡ Method 1: PowerShell Script (EASIEST)

### Run this command:
```powershell
cd D:\SecurePolicySystem\PolicyPro\NexSure
.\Encrypt-NexSureConnectionString.ps1
```

**Result:** Encrypted string automatically copied to clipboard!

---

## ⚡ Method 2: Visual Studio Unit Test

Create a new test file `ConnectionStringEncryptionTest.cs`:

```csharp
using NexSure.Security;
using Xunit;

public class ConnectionStringEncryptionTest
{
    [Fact]
    public void TestEncryptConnectionString()
    {
        // Arrange
        string plainCS = "Server=(localdb)\\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;";
        string key = "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION";
        
        var encryptionService = new EncryptionService(key);
        
        // Act
        string encrypted = encryptionService.Encrypt(plainCS);
        
        // Assert
        Assert.NotEmpty(encrypted);
        
        // Print to console/debug
        System.Console.WriteLine($"ENCRYPTED: {encrypted}");
        
        // Also test decryption
        string decrypted = encryptionService.Decrypt(encrypted);
        Assert.Equal(plainCS, decrypted);
    }
}
```

Run the test and copy the encrypted string from Debug output.

---

## ⚡ Method 3: C# Helper Class

```csharp
using NexSure.Utilities;

// In any startup file or test
var encrypted = EncryptConnectionStringHelper.EncryptNexSureConnectionString();
Console.WriteLine(encrypted);

// Or call this for formatted output:
EncryptConnectionStringHelper.DisplayEncryptionInfo();
```

---

## 📝 Step 2: Update appsettings.json

Once you have the encrypted string, update your `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "[PASTE_YOUR_ENCRYPTED_STRING_HERE]"
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

---

## ✅ Verify It Works

The application will automatically:
1. Read encrypted connection string from `appsettings.json`
2. Get encryption key from `appsettings.json`
3. Decrypt the connection string when needed
4. Use it to connect to database

No code changes needed! 🎉

---

## 🔧 Usage in Your Code

Once encrypted, your repositories will use it like this:

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
        // Automatically decrypts the connection string
        string connectionString = _connectionStringProvider.GetConnectionString();
        
        using (var connection = new SqlConnection(connectionString))
        {
            await connection.OpenAsync();
            // Your database operations
        }
    }
}
```

**No changes needed!** It's already registered in `Program.cs`.

---

## 🔐 Production Security

For production deployment:

### 1. Generate New Strong Encryption Key
```powershell
# Generate random 32+ character key
$key = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 40 | % {[char]$_})
Write-Output $key
```

### 2. Set in Environment Variable
```powershell
[Environment]::SetEnvironmentVariable("Security__EncryptionKey", "YOUR_NEW_KEY", "User")
```

### 3. Or Set in Azure/Cloud Config
- Name: `Security:EncryptionKey`
- Value: `YOUR_NEW_KEY`

### 4. Never Commit Encryption Key to Git!

---

## 📊 Summary of Files

| File | Purpose |
|------|---------|
| `Encrypt-NexSureConnectionString.ps1` | PowerShell encryption script |
| `EncryptConnectionStringHelper.cs` | C# encryption helper |
| `ConnectionStringProvider.cs` | Auto-decryption service |
| `EncryptionService.cs` | Core encryption engine |
| `appsettings.json` | Configuration (update this) |

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| PowerShell script won't run | Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Encryption key error | Ensure key is 32+ characters: `$key.Length` |
| Connection fails | Verify original connection string works first |
| "Failed to decrypt" | Encryption key in appsettings.json doesn't match the key used to encrypt |

---

## 📚 Documentation Files

- `ENCRYPT_YOUR_CONNECTION_STRING.md` - Detailed guide
- `ENCRYPTED_CONNECTION_STRING_SETUP.md` - Complete setup instructions
- `QUICK_START_ENCRYPTION.md` - Summary

---

## 🎯 Next Steps

1. ✅ Choose your encryption method (PowerShell recommended)
2. ✅ Generate encrypted string
3. ✅ Update `appsettings.json`
4. ✅ Run your application
5. ✅ Done! Your connection string is now encrypted

---

**Questions?** Check the detailed guides or test files! 🚀
