## Quick Start: Encrypt Your Connection String

### 1. Get Your Encryption Key
Your encryption key is in `appsettings.json` under `Security:EncryptionKey`. It must be at least 32 characters.

```json
"Security": {
  "EncryptionKey": "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION"
}
```

### 2. Generate Encrypted Connection String

**Your Original Connection String:**
```
Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True
```

**Run the PowerShell script:**
```powershell
cd NexSure\Scripts
.\Encrypt-ConnectionString.ps1 `
  -ConnectionString "Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True" `
  -EncryptionKey "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION"
```

The encrypted string will be copied to clipboard automatically.

### 3. Update appsettings.json

Replace the `DefaultConnection` value with the encrypted string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "[PASTE_ENCRYPTED_STRING_HERE]"
  },
  "Security": {
    "EncryptionKey": "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION",
    "IsConnectionStringEncrypted": true
  }
}
```

### 4. Use in Repository

```csharp
public class YourRepository
{
    private readonly IConnectionStringProvider _connectionStringProvider;

    public YourRepository(IConnectionStringProvider connectionStringProvider)
    {
        _connectionStringProvider = connectionStringProvider;
    }

    public void UseConnection()
    {
        // Automatically decrypts the connection string
        string connectionString = _connectionStringProvider.GetConnectionString();
        
        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();
            // Your database operations
        }
    }
}
```

### 5. Register in Program.cs

Already done! The `IConnectionStringProvider` is registered in `Program.cs`:

```csharp
builder.Services.AddScoped<IConnectionStringProvider, ConnectionStringProvider>();
```

## Architecture

```
┌─────────────────────┐
│  appsettings.json   │
│  (Encrypted CS)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  ConnectionStringProvider       │
│  - Decrypts on demand           │
│  - Caches result                │
│  - Requires IEncryptionService  │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────┐
│  Your Repository    │
│  (SQL Connection)   │
└─────────────────────┘
```

## Security Features

✅ **AES-256-CBC Encryption** - Military-grade encryption  
✅ **PBKDF2 Key Derivation** - 100,000 iterations  
✅ **Random Salt & IV** - Each encryption is unique  
✅ **Caching** - Decrypted value cached in memory  
✅ **No Hardcoding** - Keys from configuration only  
✅ **Timing-Attack Resistant** - Constant-time comparisons  

## Files Created

```
NexSure/
├── Security/
│   ├── IConnectionStringProvider.cs      (Interface)
│   ├── ConnectionStringProvider.cs       (Implementation)
│   └── ConnectionStringEncryptionUtility.cs (Helper)
├── Utilities/
│   └── ConnectionStringEncryptor.cs      (Encryption utility)
├── Scripts/
│   └── Encrypt-ConnectionString.ps1      (PowerShell script)
├── ENCRYPTED_CONNECTION_STRING_SETUP.md  (Documentation)
└── appsettings.json                      (Updated with placeholder)
```

## Next Steps

1. ✅ Update `appsettings.json` with your encrypted connection string
2. ✅ Set a strong 32+ character encryption key
3. ✅ Inject `IConnectionStringProvider` into your data access layers
4. ✅ Call `GetConnectionString()` when you need the connection

## Production Deployment

1. Store encryption key in **Azure Key Vault** or **Environment Variables**
2. Do NOT commit appsettings.json with encryption key to Git
3. Use configuration management for different environments
4. Rotate encryption keys periodically

---

For detailed setup instructions, see: **ENCRYPTED_CONNECTION_STRING_SETUP.md**
