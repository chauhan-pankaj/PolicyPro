# 🔐 Encrypt Your Connection String Now

Your connection string:
```
Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;
```

## ⚡ Quick Start (3 Steps)

### Step 1: Run the PowerShell Script

Open PowerShell in your project folder and run:

```powershell
.\Encrypt-NexSureConnectionString.ps1
```

**The script will:**
- ✅ Encrypt your connection string
- ✅ Display the encrypted result
- ✅ Copy it to your clipboard automatically

### Step 2: Update appsettings.json

Open `appsettings.json` and replace:

```json
"ConnectionStrings": {
  "DefaultConnection": "[PASTE_ENCRYPTED_STRING_HERE]"
}
```

### Step 3: Done! ✅

Your connection string is now encrypted. The application will automatically decrypt it when needed.

---

## 🔑 Security Configuration

Your current encryption key:
```
CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION
```

**⚠️ For Production:**
1. Generate a strong encryption key (32+ characters)
2. Store it in environment variables (NOT in code)
3. Never commit the key to Git

```powershell
# Set encryption key in environment
[Environment]::SetEnvironmentVariable("Security__EncryptionKey", "YOUR_NEW_SECURE_KEY", "User")
```

---

## 📂 Files Created

```
NexSure/
├── Encrypt-NexSureConnectionString.ps1    ← Run this!
├── ENCRYPT_YOUR_CONNECTION_STRING.md      ← Detailed guide
└── appsettings.json                       ← Update this
```

---

## 🎯 Architecture

```
Plain Connection String
    ↓
[Run PowerShell Script]
    ↓
Encrypted String (Base64)
    ↓
[Paste in appsettings.json]
    ↓
[Application Auto-Decrypts]
    ↓
Your Database
```

---

## ✅ Verification

After updating appsettings.json, run your application. If there are no connection errors, encryption is working! ✅

---

## 📚 For More Details

See: `ENCRYPT_YOUR_CONNECTION_STRING.md`

Happy coding! 🚀
