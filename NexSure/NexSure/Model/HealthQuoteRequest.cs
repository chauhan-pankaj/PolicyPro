namespace NexSure.Model
{
    public class HealthQuoteRequest
    {
        public int Age { get; set; }
        public string Gender { get; set; }
        public string City { get; set; }
        public decimal SumInsured { get; set; }
        public int PolicyTerm { get; set; }
    }
}
