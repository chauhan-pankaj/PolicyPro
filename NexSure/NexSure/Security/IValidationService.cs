using System.Text.RegularExpressions;

namespace NexSure.Security
{
    /// <summary>
    /// Interface for input validation and sanitization
    /// </summary>
    public interface IValidationService
    {
        bool ValidateEmail(string email);
        bool ValidatePhoneNumber(string phoneNumber);
        bool ValidateAge(int age);
        bool ValidateSumInsured(decimal sumInsured);
        string SanitizeInput(string input);
        bool ValidatePasswordStrength(string password);
    }
}
