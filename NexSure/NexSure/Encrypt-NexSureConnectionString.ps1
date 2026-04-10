#!/usr/bin/env powershell

# Quick Encryption Script for Your Connection String
# Run this script to generate encrypted connection string

param(
    [string]$ConnectionString = "Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;",
    [string]$EncryptionKey = "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION"
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   NexSure Connection String Encryption Tool                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Validate inputs
if ([string]::IsNullOrWhiteSpace($ConnectionString)) {
    Write-Host "❌ ERROR: Connection string is empty" -ForegroundColor Red
    exit 1
}

if ($EncryptionKey.Length -lt 32) {
    Write-Host "❌ ERROR: Encryption key must be at least 32 characters" -ForegroundColor Red
    Write-Host "   Current length: $($EncryptionKey.Length) characters" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Connection String: " -ForegroundColor Green -NoNewline
Write-Host $ConnectionString -ForegroundColor White
Write-Host ""

Write-Host "✓ Encryption Key Length: " -ForegroundColor Green -NoNewline
Write-Host "$($EncryptionKey.Length) characters" -ForegroundColor White
Write-Host ""

Write-Host "🔄 Encrypting connection string..." -ForegroundColor Yellow
Write-Host ""

# Define encryption class
$encryptionCode = @"
using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;

public class QuickEncrypt {
    public static string Encrypt(string plainText, string encryptionKey) {
        try {
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create()) {
                rng.GetBytes(salt);
            }
            
            using (var aes = Aes.Create()) {
                aes.KeySize = 256;
                aes.BlockSize = 128;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                byte[] derivedKey;
                using (var kdf = new Rfc2898DeriveBytes(encryptionKey, salt, 100000, HashAlgorithmName.SHA256)) {
                    derivedKey = kdf.GetBytes(32);
                }
                aes.Key = derivedKey;
                aes.GenerateIV();

                using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                using (var ms = new MemoryStream()) {
                    ms.Write(salt, 0, salt.Length);
                    ms.Write(aes.IV, 0, aes.IV.Length);

                    using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    using (var sw = new StreamWriter(cs)) {
                        sw.Write(plainText);
                    }

                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }
        catch (Exception ex) {
            throw new Exception("Encryption failed: " + ex.Message);
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $encryptionCode -ErrorAction Stop
    $encrypted = [QuickEncrypt]::Encrypt($ConnectionString, $EncryptionKey)
    
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                 ✅ ENCRYPTION SUCCESSFUL                      ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🔐 ENCRYPTED CONNECTION STRING:" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host $encrypted -ForegroundColor White
    Write-Host "─────────────────────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Copy the encrypted string above (Ctrl+C)" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Open: appsettings.json" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Replace DefaultConnection with:" -ForegroundColor White
    Write-Host ""
    Write-Host '   "DefaultConnection": "' -NoNewline
    Write-Host $encrypted -NoNewline
    Write-Host '"' -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Save the file" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Done! Your connection string is now encrypted" -ForegroundColor Green
    Write-Host ""
    
    # Try to copy to clipboard
    try {
        $encrypted | Set-Clipboard
        Write-Host "📌 Encrypted string copied to clipboard!" -ForegroundColor Green
    }
    catch {
        Write-Host "ℹ️  Manual copy required" -ForegroundColor Yellow
    }
    
}
catch {
    Write-Host "❌ ERROR: $($_)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "For more information, see: ENCRYPT_YOUR_CONNECTION_STRING.md" -ForegroundColor Gray
Write-Host ""
