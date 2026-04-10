namespace NexSure.Model
{
    //public class HealthQuoteRequest
    //{
    //    public int Age { get; set; }
    //    public string Gender { get; set; }
    //    public string City { get; set; }
    //    public decimal SumInsured { get; set; }
    //    public int PolicyTerm { get; set; }
    //}

    public class HealthQuoteRequest
    {
        public string QuoteType { get; set; }
        public List<Member> Members { get; set; } = new List<Member>();

        public int CityId { get; set; }
        public decimal SumInsured { get; set; }
        public int PolicyTerm { get; set; }

        public string PlanType { get; set; }
    }
    public class Member
    {
        public string Relation { get; set; }   // SELF, SPOUSE, CHILD, FATHER, MOTHER
        public int Age { get; set; }
        public string Gender { get; set; }
    }
}
