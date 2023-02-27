using Microsoft.AspNetCore.Http;

namespace Project.Data.Dto.Product;
public class ChangeProductPictureDto {
    public Guid ProductId { get; set; }
    public IFormFile File { get; set; }
}
