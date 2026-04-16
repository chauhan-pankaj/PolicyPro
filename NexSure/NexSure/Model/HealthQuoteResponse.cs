namespace NexSure.Model
{
    //public class HealthQuoteResponse
    //{
    //    public string InsurerName { get; set; }
    //    public List<Plan> Plans { get; set; }
    //}

    //public class Plan
    //{
    //    public string PlanName { get; set; }
    //    public decimal Premium { get; set; }
    //    public decimal SumInsured { get; set; }
    //    public string Features { get; set; }
    //}

    public class HealthQuoteResponse
    {
        public string InsurerName { get; set; }
        public List<Plan> Plans { get; set; }
    }

    public class Plan
    {
        public string PlanName { get; set; }
        public string Variant { get; set; }   // 🔥 NEW

        public decimal Premium { get; set; }
        public decimal GstAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalPremium { get; set; }

        public decimal SumInsured { get; set; }
        public string Features { get; set; }
    }
}
