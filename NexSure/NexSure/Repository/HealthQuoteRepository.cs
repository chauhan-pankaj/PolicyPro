using Dapper;
using Microsoft.Data.SqlClient;
using NexSure.Model;
using NexSure.Repository.Interface;
using NexSure.Security;
using System.Data;

namespace NexSure.Repository
{
    public class HealthQuoteRepository : IHealthQuoteRepository
    {
        private readonly string _connectionString;

        public HealthQuoteRepository(IConfiguration config, IEncryptionService encryptionService)
        {
            var encrypted = config.GetConnectionString("DefaultConnection");
            var isEncrypted = config.GetValue<bool>("Security:IsConnectionStringEncrypted");

            _connectionString = isEncrypted
                ? ConnectionStringEncryptionUtility.DecryptConnectionString(encrypted, encryptionService)
                : encrypted;
        }

        public async Task<List<Plan>> GetPlansAsync(HealthQuoteRequest request)
        {
            using var con = new SqlConnection(_connectionString);
            await con.OpenAsync();

            using var tran = con.BeginTransaction();

            try
            {
                var quoteId = await con.ExecuteScalarAsync<int>(@"
                    INSERT INTO tbl_QuoteRequest 
                    (QuoteType, CityId, SumInsured, PolicyTerm, PlanType)
                    OUTPUT INSERTED.QuoteId
                    VALUES 
                    (@QuoteType, @CityId, @SumInsured, @PolicyTerm, @PlanType)",
                    new
                    {
                        request.QuoteType,
                        request.CityId,
                        request.SumInsured,
                        request.PolicyTerm,
                        request.PlanType
                    },
                    transaction: tran
                );

                foreach (var m in request.Members)
                {
                    await con.ExecuteAsync(@"
                        INSERT INTO tbl_QuoteMember 
                        (QuoteId, Relation, Age, Gender)
                        VALUES 
                        (@QuoteId, @Relation, @Age, @Gender)",
                        new
                        {
                            QuoteId = quoteId,
                            m.Relation,
                            m.Age,
                            m.Gender
                        },
                        transaction: tran
                    );
                }

                //var plans = (await con.QueryAsync<Plan>(
                //    "usp_GetQuotePlans",
                //    new { QuoteId = quoteId },
                //    transaction: tran,
                //    commandType: CommandType.StoredProcedure
                //)).ToList();
                var plans = (await con.QueryAsync<Plan>(
                                  "usp_GetQuotePlans",
                                  new { QuoteId = quoteId, CouponCode = request.CouponCode },
                                  transaction: tran,
                                  commandType: CommandType.StoredProcedure
                              )).ToList();

                tran.Commit();

                return plans;
            }
            catch
            {
                tran.Rollback();
                throw;
            }
        }
    }
}