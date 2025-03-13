using DevOpsTechScanner.Models;

namespace DevOpsTechScanner.Services
{
    public interface IAzureDevOpsService
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task<List<Repository>> GetRepositoriesForProjectAsync(string projectName);
        Task<List<Technology>> ScanRepositoryForTechnologiesAsync(string projectName, string repositoryName);
    }
} 