using DevOpsTechScanner.Models;
using DevOpsTechScanner.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevOpsTechScanner.Functions
{
    public class SearchTechnologiesFunction
    {
        private readonly ITechnologyRepository _technologyRepository;

        public SearchTechnologiesFunction(ITechnologyRepository technologyRepository)
        {
            _technologyRepository = technologyRepository;
        }

        [FunctionName("SearchTechnologies")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "technologies/search")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Teknologiahaku käynnistyi");

            try
            {
                // Hae hakuparametrit
                string name = req.Query["name"];
                string version = req.Query["version"];

                if (string.IsNullOrEmpty(name))
                {
                    return new BadRequestObjectResult("Parametri 'name' on pakollinen");
                }

                // Hae teknologiat
                var technologies = await _technologyRepository.SearchTechnologyAsync(name, version);
                log.LogInformation($"Löydettiin {technologies.Count} teknologiaa hakuehdoilla: name={name}, version={version}");

                // Muodosta vastaus
                var result = new List<object>();
                foreach (var tech in technologies)
                {
                    result.Add(new
                    {
                        tech.Id,
                        tech.Name,
                        tech.Version,
                        tech.Type,
                        tech.DetectedDate,
                        tech.SourceFile,
                        Repository = new
                        {
                            Id = tech.RepositoryId,
                            Name = tech.RepositoryId > 0 ? 
                                (await _technologyRepository.GetRepositoriesByProjectIdAsync(tech.RepositoryId)).Find(r => r.Id == tech.RepositoryId)?.Name : string.Empty
                        },
                        Project = new
                        {
                            Name = tech.RepositoryId > 0 ? 
                                (await _technologyRepository.GetAllProjectsAsync()).Find(p => 
                                    p.Repositories.Exists(r => r.Id == tech.RepositoryId))?.Name : string.Empty
                        }
                    });
                }

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                log.LogError($"Virhe teknologiahaussa: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [FunctionName("GetAllProjects")]
        public async Task<IActionResult> GetAllProjects(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "projects")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Projektihaku käynnistyi");

            try
            {
                var projects = await _technologyRepository.GetAllProjectsAsync();
                log.LogInformation($"Löydettiin {projects.Count} projektia");

                return new OkObjectResult(projects);
            }
            catch (Exception ex)
            {
                log.LogError($"Virhe projektihaussa: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [FunctionName("GetRepositoriesByProject")]
        public async Task<IActionResult> GetRepositoriesByProject(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "projects/{projectId}/repositories")] HttpRequest req,
            int projectId,
            ILogger log)
        {
            log.LogInformation($"Repositoriohaku käynnistyi projektille {projectId}");

            try
            {
                var repositories = await _technologyRepository.GetRepositoriesByProjectIdAsync(projectId);
                log.LogInformation($"Löydettiin {repositories.Count} repositoriota projektille {projectId}");

                return new OkObjectResult(repositories);
            }
            catch (Exception ex)
            {
                log.LogError($"Virhe repositoriohaussa: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [FunctionName("GetTechnologiesByRepository")]
        public async Task<IActionResult> GetTechnologiesByRepository(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "repositories/{repositoryId}/technologies")] HttpRequest req,
            int repositoryId,
            ILogger log)
        {
            log.LogInformation($"Teknologiahaku käynnistyi repositoriolle {repositoryId}");

            try
            {
                var technologies = await _technologyRepository.GetTechnologiesByRepositoryIdAsync(repositoryId);
                log.LogInformation($"Löydettiin {technologies.Count} teknologiaa repositoriolle {repositoryId}");

                return new OkObjectResult(technologies);
            }
            catch (Exception ex)
            {
                log.LogError($"Virhe teknologiahaussa: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
} 