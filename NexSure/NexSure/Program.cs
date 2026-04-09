using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Add services
builder.Services.AddControllers();

// 🔥 Swagger / OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SecurePolicySystem API",
        Version = "v1",
        Description = "NexSure Insurance APIs for Health Quotes"
    });
});

var app = builder.Build();

// 🔥 Enable Swagger (Development + optional Production)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "SecurePolicySystem API v1");
        options.RoutePrefix = "swagger"; // URL: /swagger
    });
}
else
{
    // 👉 Agar production me bhi Swagger chahiye toh ye ON rakho
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();