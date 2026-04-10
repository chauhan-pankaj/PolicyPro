using System.Text.RegularExpressions;

namespace NexSure.Security
{
    /// <summary>
    /// Input validation and sanitization service
    /// </summary>
    public class ValidationService : IValidationService
    {
        private const int MinPasswordLength = 12;
        private const int MinAge = 18;
        private const int MaxAge = 100;
        private const decimal MinSumInsured = 100000;
        private const decimal MaxSumInsured = 10000000;

        public bool ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var emailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.IgnoreCase);
                return emailRegex.IsMatch(email) && email.Length <= 254;
            }
            catch
            {
                return false;
            }
        }

        public bool ValidatePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return false;

            // Remove common separators
            string cleaned = Regex.Replace(phoneNumber, @"[\s\-\(\)\.]+", "");
            
            // Check if it's 10+ digits
            return Regex.IsMatch(cleaned, @"^\d{10,}$");
        }

        public bool ValidateAge(int age)
        {
            return age >= MinAge && age <= MaxAge;
        }

        public bool ValidateSumInsured(decimal sumInsured)
        {
            return sumInsured >= MinSumInsured && sumInsured <= MaxSumInsured;
        }

        public string SanitizeInput(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            // Remove potentially dangerous characters
            string sanitized = Regex.Replace(input, @"[<>""'%;()&+]", "");
            
            // Trim whitespace
            return sanitized.Trim();
        }

        public bool ValidatePasswordStrength(string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;

            // Check minimum length
            if (password.Length < MinPasswordLength)
                return false;

            // Check for uppercase
            if (!Regex.IsMatch(password, @"[A-Z]"))
                return false;

            // Check for lowercase
            if (!Regex.IsMatch(password, @"[a-z]"))
                return false;

            // Check for digits
            if (!Regex.IsMatch(password, @"[\d]"))
                return false;

            // Check for special characters
            if (!Regex.IsMatch(password, @"[!@#$%^&*\-_=+\[\]{}|;:,.<>?]"))
                return false;

            return true;
        }
    }
}
