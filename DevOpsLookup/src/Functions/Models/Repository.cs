namespace DevOpsTechScanner.Models
{
    public class Repository
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public List<Technology> Technologies { get; set; } = new List<Technology>();
    }
} 