using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace React_Crud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FileController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class FileUploadModel
        {
            public IFormFile File { get; set; }
        }

        [HttpPost("upload"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile([FromForm] FileUploadModel model)
        {
            if (model.File == null || model.File.Length == 0)
            {
                return BadRequest("Invalid File");
            }

            var folderName = Path.Combine("Docs", "uploads", "AllFiles");
            var pathtoSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            if (!Directory.Exists(pathtoSave))
            {
                Directory.CreateDirectory(pathtoSave);
            }

            var filename = $"{Path.GetFileNameWithoutExtension(model.File.FileName)}_{DateTime.Now:yyyy_MM_dd_HH_mm_ss_fff}{Path.GetExtension(model.File.FileName)}";
            var fullPath = Path.Combine(pathtoSave, filename);
            var dbPath = Path.Combine(folderName, filename).Replace("\\", "/"); // Replace backslashes with forward slashes

            if (System.IO.File.Exists(fullPath))
            {
                return BadRequest("File already exists");
            }

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await model.File.CopyToAsync(stream);
            }

            // Get the base URL of your application
            var baseUrl = $"{this.Request.Scheme}://{this.Request.Host}";

            // Generate the full URL path
            var fullUrlPath = $"{baseUrl}/{dbPath}";

            // Automatically fetch filename and content type
            var contentType = model.File.ContentType;

            return Ok(new { fullUrlPath, filename, contentType });
        }
    }
}
