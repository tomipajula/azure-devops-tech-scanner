namespace DevOpsTechScanner.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime LastScanned { get; set; }
        public List<Repository> Repositories { get; set; } = new List<Repository>();
    }
} 