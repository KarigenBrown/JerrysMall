using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.DTO;

public class RegisterDto : LoginDto
{
    [Required]
    public string Email { get; set; }
}