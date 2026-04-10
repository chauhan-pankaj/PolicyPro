using Microsoft.AspNetCore.OpenApi;
using NexSure.Controllers.Interface;
using NexSure.Repository;
using NexSure.Repository.Interface;
using NexSure.Services;
using NexSure.Security;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Add services
builder.Services.AddControllers();

// 🔹 Register Repository and Service for Dependency Injection
builder.Services.AddScoped<IHealthQuoteRepository, HealthQuoteRepository>();
builder.Services.AddScoped<INexSureController, NexSureService>();

// 🔹 Register Security Services
var encryptionKey = builder.Configuration.GetValue<string>("Security:EncryptionKey");
if (string.IsNullOrEmpty(encryptionKey) || encryptionKey.Length < 32)
{
    throw new InvalidOperationException("Security:EncryptionKey must be at least 32 characters long. Configure in appsettings.json or environment variables.");
}

builder.Services.AddScoped<IEncryptionService>(sp => new EncryptionService(encryptionKey));
builder.Services.AddScoped<IValidationService, ValidationService>();
builder.Services.AddScoped<IAuditLogger, AuditLogger>();
builder.Services.AddScoped<IConnectionStringProvider, ConnectionStringProvider>();

// 🔥 Swagger / OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Name = "X-API-Key",
        Description = "API Key for authentication. Use: NEXSURE-API-KEY-2026-9XKLM42PQR"
    });
});

var app = builder.Build();

// 🔹 Add API Key Authentication Middleware
app.UseMiddleware<ApiKeyAuthenticationMiddleware>();

// 🔥 Enable Swagger (Development + optional Production)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "NexSure Insurance API v1");
        options.RoutePrefix = "swagger"; // URL: /swagger
    });
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();