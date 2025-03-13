using DevOpsTechScanner.Services;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(DevOpsTechScanner.Startup))]

namespace DevOpsTechScanner
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<KeyVaultService>();
            builder.Services.AddSingleton<ITechnologyRepository, SqlTechnologyRepository>();
            builder.Services.AddHttpClient();
        }
    }
} 