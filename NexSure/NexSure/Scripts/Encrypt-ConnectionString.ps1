#!/usr/bin/env pwsh
# PowerShell script to encrypt connection string for appsettings.json
# Run this script to generate encrypted connection string

param(
    [string]$ConnectionString = "Server=(localdb)\MSSQLLocalDB;Database=NexSure;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True",
    [string]$EncryptionKey = "CHANGE_ME_TO_SECURE_KEY_AT_LEAST_32_CHARS_LONG_IN_PRODUCTION"
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Connection String Encryptor" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if ($EncryptionKey.Length -lt 32) {
    Write-Host "ERROR: Encryption key must be at least 32 characters long!" -ForegroundColor Red
    Write-Host "Current length: $($EncryptionKey.Length)" -ForegroundColor Red
    exit 1
}

Write-Host "Plain Connection String:" -ForegroundColor Yellow
Write-Host $ConnectionString -ForegroundColor White
Write-Host ""

Write-Host "Encryption Key Length:" -ForegroundColor Yellow
Write-Host "$($EncryptionKey.Length) characters" -ForegroundColor White
Write-Host ""

# Create a PowerShell script that will encrypt using .NET
$encryptionScript = @"
using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;

public class ConnectionStringEncryption {
    public static string Encrypt(string plainText, string encryptionKey) {
        if (string.IsNullOrEmpty(plainText))
            return plainText;

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
                using (var keyGenerator = new Rfc2898DeriveBytes(encryptionKey, salt, 100000, HashAlgorithmName.SHA256)) {
                    derivedKey = keyGenerator.GetBytes(aes.KeySize / 8);
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
            throw new InvalidOperationException("Encryption failed", ex);
        }
    }
}
"@

Write-Host "Encrypting connection string..." -ForegroundColor Cyan

try {
    Add-Type -TypeDefinition $encryptionScript -ErrorAction Stop
    $encrypted = [ConnectionStringEncryption]::Encrypt($ConnectionString, $EncryptionKey)
    
    Write-Host "✓ Encryption successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Encrypted Connection String:" -ForegroundColor Yellow
    Write-Host $encrypted -ForegroundColor White
    Write-Host ""
    Write-Host "Copy the above encrypted string to appsettings.json under:" -ForegroundColor Cyan
    Write-Host '"ConnectionStrings": { "DefaultConnection": "[PASTE_HERE]" }' -ForegroundColor Gray
    Write-Host ""
    
    # Copy to clipboard
    $encrypted | Set-Clipboard
    Write-Host "✓ Encrypted string copied to clipboard!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
