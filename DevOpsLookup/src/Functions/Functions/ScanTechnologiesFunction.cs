using DevOpsTechScanner.Models;
using DevOpsTechScanner.Services;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevOpsTechScanner.Functions
{
    public class ScanTechnologiesFunction
    {
        private readonly KeyVaultService _keyVaultService;
        private readonly ITechnologyRepository _technologyRepository;
        private readonly IConfiguration _configuration;

        public ScanTechnologiesFunction(
            KeyVaultService keyVaultService,
            ITechnologyRepository technologyRepository,
            IConfiguration configuration)
        {
            _keyVaultService = keyVaultService;
            _technologyRepository = technologyRepository;
            _configuration = configuration;
        }

        [FunctionName("ScanTechnologies")]
        public async Task Run(
            [TimerTrigger("%ScanSchedule%")] TimerInfo myTimer,
            ILogger log)
        {
            log.LogInformation($"Teknologiaskannaus käynnistyi: {DateTime.UtcNow}");

            try
            {
                // Hae Azure DevOps PAT-token Key Vaultista
                var pat = await _keyVaultService.GetSecretAsync("AzureDevOpsPat");

                // Luo Azure DevOps -palvelu
                var azureDevOpsService = new AzureDevOpsService(_configuration, pat);

                // Hae kaikki projektit
                var projects = await azureDevOpsService.GetAllProjectsAsync();
                log.LogInformation($"Löydettiin {projects.Count} projektia");

                foreach (var project in projects)
                {
                    // Tallenna projekti tietokantaan
                    await _technologyRepository.SaveProjectAsync(project);
                    log.LogInformation($"Skannataan projektia: {project.Name}");

                    // Hae kaikki repositoriot projektista
                    var repositories = await azureDevOpsService.GetRepositoriesForProjectAsync(project.Name);
                    log.LogInformation($"Löydettiin {repositories.Count} repositoriota projektista {project.Name}");

                    foreach (var repository in repositories)
                    {
                        repository.ProjectId = project.Id;
                        
                        // Tallenna repositorio tietokantaan
                        await _technologyRepository.SaveRepositoryAsync(repository);
                        log.LogInformation($"Skannataan repositoriota: {repository.Name}");

                        // Skannaa teknologiat repositoriosta
                        var technologies = await azureDevOpsService.ScanRepositoryForTechnologiesAsync(project.Name, repository.Name);
                        log.LogInformation($"Löydettiin {technologies.Count} teknologiaa repositoriosta {repository.Name}");

                        // Aseta repositorion ID teknologioille
                        foreach (var technology in technologies)
                        {
                            technology.RepositoryId = repository.Id;
                        }

                        // Tallenna teknologiat tietokantaan
                        await _technologyRepository.SaveTechnologiesAsync(technologies);
                    }
                }

                log.LogInformation($"Teknologiaskannaus valmistui onnistuneesti: {DateTime.UtcNow}");
            }
            catch (Exception ex)
            {
                log.LogError($"Virhe teknologiaskannauksessa: {ex.Message}");
                throw;
            }
        }
    }
} 