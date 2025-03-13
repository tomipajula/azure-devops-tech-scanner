namespace DevOpsTechScanner.Models
{
    public class Technology
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Framework, Library, Tool, etc.
        public int RepositoryId { get; set; }
        public DateTime DetectedDate { get; set; }
        public string SourceFile { get; set; } = string.Empty;
    }
} 