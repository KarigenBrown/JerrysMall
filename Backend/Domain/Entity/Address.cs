using System.Text.Json.Serialization;

namespace Backend.Domain.Entity;

public class Address
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string Address1 { get; set; }
    public string? Address2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string Zip { get; set; }
    public required string Country { get; set; }
}