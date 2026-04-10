namespace NexSure.Security
{
    /// <summary>
    /// Interface for managing encrypted connection strings
    /// </summary>
    public interface IConnectionStringProvider
    {
        string GetConnectionString(string name = "DefaultConnection");
    }
}
