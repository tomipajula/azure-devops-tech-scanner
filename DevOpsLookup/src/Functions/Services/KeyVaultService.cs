using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;

namespace DevOpsTechScanner.Services
{
    public class KeyVaultService
    {
        private readonly SecretClient _secretClient;

        public KeyVaultService(IConfiguration configuration)
        {
            var keyVaultUri = configuration["KeyVaultUri"] ?? throw new ArgumentNullException("KeyVaultUri");
            _secretClient = new SecretClient(new Uri(keyVaultUri), new DefaultAzureCredential());
        }

        public async Task<string> GetSecretAsync(string secretName)
        {
            var secret = await _secretClient.GetSecretAsync(secretName);
            return secret.Value.Value;
        }
    }
} 