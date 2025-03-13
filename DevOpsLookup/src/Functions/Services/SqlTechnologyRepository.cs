using DevOpsTechScanner.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace DevOpsTechScanner.Services
{
    public class SqlTechnologyRepository : ITechnologyRepository
    {
        private readonly string _connectionString;

        public SqlTechnologyRepository(IConfiguration configuration)
        {
            _connectionString = configuration["SqlConnectionString"] ?? throw new ArgumentNullException("SqlConnectionString");
        }

        public async Task SaveProjectAsync(Project project)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // Tarkista, onko projekti jo olemassa
            var checkCommand = new SqlCommand(
                "SELECT Id FROM Projects WHERE Name = @Name", 
                connection);
            checkCommand.Parameters.AddWithValue("@Name", project.Name);
            
            var existingId = await checkCommand.ExecuteScalarAsync();
            
            if (existingId != null)
            {
                // Päivitä olemassa oleva projekti
                project.Id = (int)existingId;
                
                var updateCommand = new SqlCommand(
                    "UPDATE Projects SET Description = @Description, LastScanned = @LastScanned WHERE Id = @Id", 
                    connection);
                updateCommand.Parameters.AddWithValue("@Id", project.Id);
                updateCommand.Parameters.AddWithValue("@Description", project.Description);
                updateCommand.Parameters.AddWithValue("@LastScanned", project.LastScanned);
                
                await updateCommand.ExecuteNonQueryAsync();
            }
            else
            {
                // Lisää uusi projekti
                var insertCommand = new SqlCommand(
                    "INSERT INTO Projects (Name, Description, LastScanned) VALUES (@Name, @Description, @LastScanned); SELECT SCOPE_IDENTITY();", 
                    connection);
                insertCommand.Parameters.AddWithValue("@Name", project.Name);
                insertCommand.Parameters.AddWithValue("@Description", project.Description);
                insertCommand.Parameters.AddWithValue("@LastScanned", project.LastScanned);
                
                var newId = await insertCommand.ExecuteScalarAsync();
                project.Id = Convert.ToInt32(newId);
            }
        }

        public async Task SaveRepositoryAsync(Repository repository)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // Tarkista, onko repositorio jo olemassa
            var checkCommand = new SqlCommand(
                "SELECT Id FROM Repositories WHERE Name = @Name AND ProjectId = @ProjectId", 
                connection);
            checkCommand.Parameters.AddWithValue("@Name", repository.Name);
            checkCommand.Parameters.AddWithValue("@ProjectId", repository.ProjectId);
            
            var existingId = await checkCommand.ExecuteScalarAsync();
            
            if (existingId != null)
            {
                // Päivitä olemassa oleva repositorio
                repository.Id = (int)existingId;
                
                var updateCommand = new SqlCommand(
                    "UPDATE Repositories SET Url = @Url WHERE Id = @Id", 
                    connection);
                updateCommand.Parameters.AddWithValue("@Id", repository.Id);
                updateCommand.Parameters.AddWithValue("@Url", repository.Url);
                
                await updateCommand.ExecuteNonQueryAsync();
            }
            else
            {
                // Lisää uusi repositorio
                var insertCommand = new SqlCommand(
                    "INSERT INTO Repositories (Name, Url, ProjectId) VALUES (@Name, @Url, @ProjectId); SELECT SCOPE_IDENTITY();", 
                    connection);
                insertCommand.Parameters.AddWithValue("@Name", repository.Name);
                insertCommand.Parameters.AddWithValue("@Url", repository.Url);
                insertCommand.Parameters.AddWithValue("@ProjectId", repository.ProjectId);
                
                var newId = await insertCommand.ExecuteScalarAsync();
                repository.Id = Convert.ToInt32(newId);
            }
        }

        public async Task SaveTechnologiesAsync(List<Technology> technologies)
        {
            if (technologies.Count == 0)
                return;

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            foreach (var technology in technologies)
            {
                // Tarkista, onko teknologia jo olemassa
                var checkCommand = new SqlCommand(
                    "SELECT Id FROM Technologies WHERE Name = @Name AND Version = @Version AND RepositoryId = @RepositoryId", 
                    connection);
                checkCommand.Parameters.AddWithValue("@Name", technology.Name);
                checkCommand.Parameters.AddWithValue("@Version", technology.Version);
                checkCommand.Parameters.AddWithValue("@RepositoryId", technology.RepositoryId);
                
                var existingId = await checkCommand.ExecuteScalarAsync();
                
                if (existingId != null)
                {
                    // Päivitä olemassa oleva teknologia
                    technology.Id = (int)existingId;
                    
                    var updateCommand = new SqlCommand(
                        "UPDATE Technologies SET Type = @Type, DetectedDate = @DetectedDate, SourceFile = @SourceFile WHERE Id = @Id", 
                        connection);
                    updateCommand.Parameters.AddWithValue("@Id", technology.Id);
                    updateCommand.Parameters.AddWithValue("@Type", technology.Type);
                    updateCommand.Parameters.AddWithValue("@DetectedDate", technology.DetectedDate);
                    updateCommand.Parameters.AddWithValue("@SourceFile", technology.SourceFile);
                    
                    await updateCommand.ExecuteNonQueryAsync();
                }
                else
                {
                    // Lisää uusi teknologia
                    var insertCommand = new SqlCommand(
                        "INSERT INTO Technologies (Name, Version, Type, RepositoryId, DetectedDate, SourceFile) " +
                        "VALUES (@Name, @Version, @Type, @RepositoryId, @DetectedDate, @SourceFile); SELECT SCOPE_IDENTITY();", 
                        connection);
                    insertCommand.Parameters.AddWithValue("@Name", technology.Name);
                    insertCommand.Parameters.AddWithValue("@Version", technology.Version);
                    insertCommand.Parameters.AddWithValue("@Type", technology.Type);
                    insertCommand.Parameters.AddWithValue("@RepositoryId", technology.RepositoryId);
                    insertCommand.Parameters.AddWithValue("@DetectedDate", technology.DetectedDate);
                    insertCommand.Parameters.AddWithValue("@SourceFile", technology.SourceFile);
                    
                    var newId = await insertCommand.ExecuteScalarAsync();
                    technology.Id = Convert.ToInt32(newId);
                }
            }
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            var projects = new List<Project>();
            
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var command = new SqlCommand("SELECT Id, Name, Description, LastScanned FROM Projects", connection);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                projects.Add(new Project
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.GetString(2),
                    LastScanned = reader.GetDateTime(3)
                });
            }
            
            return projects;
        }

        public async Task<List<Repository>> GetRepositoriesByProjectIdAsync(int projectId)
        {
            var repositories = new List<Repository>();
            
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var command = new SqlCommand(
                "SELECT Id, Name, Url, ProjectId FROM Repositories WHERE ProjectId = @ProjectId", 
                connection);
            command.Parameters.AddWithValue("@ProjectId", projectId);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                repositories.Add(new Repository
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Url = reader.GetString(2),
                    ProjectId = reader.GetInt32(3)
                });
            }
            
            return repositories;
        }

        public async Task<List<Technology>> GetTechnologiesByRepositoryIdAsync(int repositoryId)
        {
            var technologies = new List<Technology>();
            
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var command = new SqlCommand(
                "SELECT Id, Name, Version, Type, RepositoryId, DetectedDate, SourceFile FROM Technologies WHERE RepositoryId = @RepositoryId", 
                connection);
            command.Parameters.AddWithValue("@RepositoryId", repositoryId);
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                technologies.Add(new Technology
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Version = reader.GetString(2),
                    Type = reader.GetString(3),
                    RepositoryId = reader.GetInt32(4),
                    DetectedDate = reader.GetDateTime(5),
                    SourceFile = reader.GetString(6)
                });
            }
            
            return technologies;
        }

        public async Task<List<Technology>> SearchTechnologyAsync(string name, string? version = null)
        {
            var technologies = new List<Technology>();
            
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            
            var sql = @"
                SELECT t.Id, t.Name, t.Version, t.Type, t.RepositoryId, t.DetectedDate, t.SourceFile, 
                       r.Name as RepositoryName, p.Name as ProjectName
                FROM Technologies t
                JOIN Repositories r ON t.RepositoryId = r.Id
                JOIN Projects p ON r.ProjectId = p.Id
                WHERE t.Name LIKE @Name";
            
            if (!string.IsNullOrEmpty(version))
            {
                sql += " AND t.Version LIKE @Version";
            }
            
            var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Name", $"%{name}%");
            
            if (!string.IsNullOrEmpty(version))
            {
                command.Parameters.AddWithValue("@Version", $"%{version}%");
            }
            
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var technology = new Technology
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Version = reader.GetString(2),
                    Type = reader.GetString(3),
                    RepositoryId = reader.GetInt32(4),
                    DetectedDate = reader.GetDateTime(5),
                    SourceFile = reader.GetString(6)
                };
                
                // Lisää repositorion ja projektin nimet
                var repository = new Repository
                {
                    Id = technology.RepositoryId,
                    Name = reader.GetString(7)
                };
                
                repository.Technologies.Add(technology);
                
                var project = new Project
                {
                    Name = reader.GetString(8)
                };
                
                project.Repositories.Add(repository);
                
                technologies.Add(technology);
            }
            
            return technologies;
        }
    }
} 