using DevOpsTechScanner.Models;

namespace DevOpsTechScanner.Services
{
    public interface ITechnologyRepository
    {
        Task SaveProjectAsync(Project project);
        Task SaveRepositoryAsync(Repository repository);
        Task SaveTechnologiesAsync(List<Technology> technologies);
        Task<List<Project>> GetAllProjectsAsync();
        Task<List<Repository>> GetRepositoriesByProjectIdAsync(int projectId);
        Task<List<Technology>> GetTechnologiesByRepositoryIdAsync(int repositoryId);
        Task<List<Technology>> SearchTechnologyAsync(string name, string? version = null);
    }
} 