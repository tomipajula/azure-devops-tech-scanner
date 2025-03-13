using DevOpsTechScanner.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace DevOpsTechScanner.Services
{
    public class AzureDevOpsService : IAzureDevOpsService
    {
        private readonly string _organizationUrl;
        private readonly string _pat;
        private readonly GitHttpClient _gitClient;

        public AzureDevOpsService(IConfiguration configuration, string pat)
        {
            _organizationUrl = configuration["AzureDevOpsOrganizationUrl"] ?? throw new ArgumentNullException("AzureDevOpsOrganizationUrl");
            _pat = pat ?? throw new ArgumentNullException(nameof(pat));

            var credentials = new VssBasicCredential(string.Empty, _pat);
            var connection = new VssConnection(new Uri(_organizationUrl), credentials);
            _gitClient = connection.GetClient<GitHttpClient>();
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            var projects = new List<Project>();
            var azureDevOpsProjects = await _gitClient.GetProjectsAsync();

            foreach (var project in azureDevOpsProjects)
            {
                projects.Add(new Project
                {
                    Name = project.Name,
                    Description = project.Description ?? string.Empty,
                    LastScanned = DateTime.UtcNow
                });
            }

            return projects;
        }

        public async Task<List<Repository>> GetRepositoriesForProjectAsync(string projectName)
        {
            var repositories = new List<Repository>();
            var azureDevOpsRepositories = await _gitClient.GetRepositoriesAsync(projectName);

            foreach (var repo in azureDevOpsRepositories)
            {
                repositories.Add(new Repository
                {
                    Name = repo.Name,
                    Url = repo.RemoteUrl
                });
            }

            return repositories;
        }

        public async Task<List<Technology>> ScanRepositoryForTechnologiesAsync(string projectName, string repositoryName)
        {
            var technologies = new List<Technology>();
            
            // Lista tiedostoista, joita halutaan tarkistaa
            var configFiles = new Dictionary<string, string>
            {
                { "package.json", "npm" },
                { "package-lock.json", "npm" },
                { "yarn.lock", "yarn" },
                { "pom.xml", "maven" },
                { "build.gradle", "gradle" },
                { "requirements.txt", "python" },
                { "Pipfile", "python" },
                { "Pipfile.lock", "python" },
                { "Gemfile", "ruby" },
                { "Gemfile.lock", "ruby" },
                { "*.csproj", "dotnet" },
                { "*.fsproj", "dotnet" },
                { "*.vbproj", "dotnet" },
                { "go.mod", "go" },
                { "composer.json", "php" },
                { "composer.lock", "php" },
                { "azure-pipelines.yml", "azure-pipelines" },
                { "Dockerfile", "docker" }
            };

            foreach (var configFile in configFiles)
            {
                try
                {
                    // Etsi tiedostot repositoriosta
                    var items = await _gitClient.GetItemsAsync(
                        projectName,
                        repositoryName,
                        recursionLevel: VersionControlRecursionType.Full);

                    // Suodata tiedostot nimen perusteella
                    var matchingItems = items.Where(item => 
                        item.IsFolder == false && 
                        (item.Path.EndsWith(configFile.Key) || 
                         (configFile.Key.StartsWith("*") && item.Path.EndsWith(configFile.Key.Substring(1))))
                    ).ToList();

                    foreach (var item in matchingItems)
                    {
                        // Hae tiedoston sisältö
                        var fileContent = await _gitClient.GetItemContentAsync(
                            projectName,
                            repositoryName,
                            item.Path);

                        using var streamReader = new StreamReader(fileContent);
                        var content = await streamReader.ReadToEndAsync();

                        // Analysoi tiedoston sisältö teknologioiden tunnistamiseksi
                        var detectedTechnologies = ParseTechnologiesFromFile(configFile.Key, content, configFile.Value);
                        
                        foreach (var tech in detectedTechnologies)
                        {
                            tech.SourceFile = item.Path;
                            tech.DetectedDate = DateTime.UtcNow;
                            technologies.Add(tech);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Tiedostoa ei löytynyt tai muu virhe, jatka seuraavaan
                    Console.WriteLine($"Virhe tiedoston {configFile.Key} käsittelyssä: {ex.Message}");
                }
            }

            return technologies;
        }

        private List<Technology> ParseTechnologiesFromFile(string fileName, string content, string type)
        {
            var technologies = new List<Technology>();

            try
            {
                if (fileName == "package.json")
                {
                    // Parse package.json
                    var packageJson = JsonSerializer.Deserialize<JsonElement>(content);
                    
                    if (packageJson.TryGetProperty("dependencies", out var dependencies))
                    {
                        foreach (var dep in dependencies.EnumerateObject())
                        {
                            var version = dep.Value.GetString() ?? "";
                            // Poista versioista ^, ~ ja muut merkit
                            version = Regex.Replace(version, @"[\^~>=<]", "");
                            
                            technologies.Add(new Technology
                            {
                                Name = dep.Name,
                                Version = version,
                                Type = "npm-package"
                            });
                        }
                    }
                    
                    if (packageJson.TryGetProperty("devDependencies", out var devDependencies))
                    {
                        foreach (var dep in devDependencies.EnumerateObject())
                        {
                            var version = dep.Value.GetString() ?? "";
                            // Poista versioista ^, ~ ja muut merkit
                            version = Regex.Replace(version, @"[\^~>=<]", "");
                            
                            technologies.Add(new Technology
                            {
                                Name = dep.Name,
                                Version = version,
                                Type = "npm-dev-package"
                            });
                        }
                    }
                }
                else if (fileName.EndsWith(".csproj") || fileName.EndsWith(".fsproj") || fileName.EndsWith(".vbproj"))
                {
                    // Parse .NET project files
                    var packageRefPattern = @"<PackageReference\s+Include=""([^""]+)""\s+Version=""([^""]+)""\s*\/>";
                    var matches = Regex.Matches(content, packageRefPattern);
                    
                    foreach (Match match in matches)
                    {
                        if (match.Groups.Count >= 3)
                        {
                            technologies.Add(new Technology
                            {
                                Name = match.Groups[1].Value,
                                Version = match.Groups[2].Value,
                                Type = "nuget-package"
                            });
                        }
                    }
                }
                else if (fileName == "requirements.txt")
                {
                    // Parse Python requirements.txt
                    var lines = content.Split('\n');
                    foreach (var line in lines)
                    {
                        var trimmedLine = line.Trim();
                        if (string.IsNullOrEmpty(trimmedLine) || trimmedLine.StartsWith("#"))
                            continue;
                            
                        var parts = trimmedLine.Split(new[] { '=', '>', '<', '~' }, 2);
                        if (parts.Length >= 2)
                        {
                            technologies.Add(new Technology
                            {
                                Name = parts[0].Trim(),
                                Version = parts[1].Trim(),
                                Type = "python-package"
                            });
                        }
                        else if (parts.Length == 1)
                        {
                            technologies.Add(new Technology
                            {
                                Name = parts[0].Trim(),
                                Version = "latest",
                                Type = "python-package"
                            });
                        }
                    }
                }
                else if (fileName == "pom.xml")
                {
                    // Parse Maven pom.xml
                    var dependencyPattern = @"<dependency>\s*<groupId>([^<]+)</groupId>\s*<artifactId>([^<]+)</artifactId>\s*<version>([^<]+)</version>";
                    var matches = Regex.Matches(content, dependencyPattern);
                    
                    foreach (Match match in matches)
                    {
                        if (match.Groups.Count >= 4)
                        {
                            technologies.Add(new Technology
                            {
                                Name = $"{match.Groups[1].Value}:{match.Groups[2].Value}",
                                Version = match.Groups[3].Value,
                                Type = "maven-package"
                            });
                        }
                    }
                }
                else if (fileName == "Dockerfile")
                {
                    // Parse Dockerfile
                    var fromPattern = @"FROM\s+([^:\s]+)(?::([^:\s]+))?";
                    var matches = Regex.Matches(content, fromPattern, RegexOptions.IgnoreCase);
                    
                    foreach (Match match in matches)
                    {
                        if (match.Groups.Count >= 2)
                        {
                            technologies.Add(new Technology
                            {
                                Name = match.Groups[1].Value,
                                Version = match.Groups.Count >= 3 ? match.Groups[2].Value : "latest",
                                Type = "docker-image"
                            });
                        }
                    }
                }
                // Lisää muita tiedostotyyppien parsimislogiikkaa tarpeen mukaan
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Virhe tiedoston {fileName} parsimisessa: {ex.Message}");
            }
            
            return technologies;
        }
    }
} 