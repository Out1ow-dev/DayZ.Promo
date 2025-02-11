using SkiaSharp;
using System.IO;
using CrazyDayZ.Promo.Extensions;
using CrazyDayZ.Promo.Models.Dto;
using CrazyDayZ.Promo.Persistence;
using Microsoft.AspNetCore.Mvc;
using Image = CrazyDayZ.Promo.Models.Image;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CrazyDayZ.Promo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class GeneratePromoController : ControllerBase
{
    private readonly Persistence.DbContext _dbContext;
    private readonly IWebHostEnvironment _env;

    public GeneratePromoController(Persistence.DbContext dbContext, IWebHostEnvironment env)
    {
        _dbContext = dbContext;
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePromo([FromBody] PostImageDto postImageDto)
    {
        if (postImageDto == null)
        {
            return BadRequest("Invalid server data");
        }

        var promoCode = Guid.NewGuid().ToString();
        var imageId = Guid.NewGuid();

        var promoUrl = Url.Action(nameof(GetPromo), new { id = imageId });

        var qrCodeFileName = $"{imageId}.png";
        var qrCodePath = Path.Combine(_env.WebRootPath, "qr-codes", qrCodeFileName);
        Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "qr-codes"));

        // Генерация QR-кода
        QrCodeGenerator.GenerateQrCode(promoUrl, qrCodePath);

        // Путь к шаблону изображения
        var templatePath = Path.Combine(_env.WebRootPath, "templates", "PromoTemplate.png");

        // Путь для сохранения финального изображения
        var finalImagePath = Path.Combine(_env.WebRootPath, "promo-images", $"{imageId}.png");
        Directory.CreateDirectory(Path.Combine(_env.WebRootPath, "promo-images"));

        // Путь к кастомному шрифту
        var fontPath = Path.Combine(_env.WebRootPath, "fonts", "MYRIADPRO-BOLD.ttf");

        using (var templateStream = System.IO.File.OpenRead(templatePath))
        using (var qrCodeStream = System.IO.File.OpenRead(qrCodePath))
        using (var fontStream = System.IO.File.OpenRead(fontPath))
        using (var finalImageStream = System.IO.File.Create(finalImagePath))
        {
            using var templateBitmap = SKBitmap.Decode(templateStream);
            using var canvas = new SKCanvas(templateBitmap);

            using var qrCodeBitmap = SKBitmap.Decode(qrCodeStream);

            int qrCodeWidth = 300;
            int qrCodeHeight = 300;
            int qrCodeX = templateBitmap.Width - qrCodeWidth - 115;
            int qrCodeY = (templateBitmap.Height - qrCodeHeight) / 2;

            canvas.DrawBitmap(qrCodeBitmap, new SKRect(qrCodeX, qrCodeY, qrCodeX + qrCodeWidth, qrCodeY + qrCodeHeight));

            using var typeface = SKTypeface.FromStream(fontStream);

            var textPaint = new SKPaint
            {
                Color = SKColors.Black,
                TextSize = 24, // Размер текста
                IsAntialias = true,
                Typeface = typeface // Используем кастомный шрифт
            };

            string expirationDateText = "*Действителен до: " + postImageDto.ExpirationDate.ToString("dd.MM.yyyy");

            float textX = 85; // Отступ слева
            float textY = templateBitmap.Height - 220; // Отступ снизу

            // Рисуем текст на шаблоне
            canvas.DrawText(expirationDateText, textX, textY, textPaint);

            // Сохраняем финальное изображение
            using var finalImage = SKImage.FromBitmap(templateBitmap);
            using var data = finalImage.Encode(SKEncodedImageFormat.Png, 100);
            data.SaveTo(finalImageStream);
        }

        // Сохраняем информацию о промокоде в базе данных
        Image image = new Image
        {
            Id = imageId,
            Name = postImageDto.Name,
            Promo = promoCode,
            QrCodePath = $"qr-codes/{imageId}.png",
            FinalImagePath = $"promo-images/{imageId}.png",
            ExpirationDate = postImageDto.ExpirationDate
        };

        _dbContext.Images.Add(image);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPromo), new { id = image.Id }, image);
    }

    [HttpGet("{id}")]
    public IActionResult GetPromo(Guid id)
    {
        var image = _dbContext.Images.Find(id);
        if (image == null)
            return NotFound();

        return Ok(new
        {
            Promo = image.Promo,
            QrCodeUrl = Url.Content($"~/qr-codes/{image.Id}.png?v={image.Version}"),
            FinalImageUrl = Url.Content($"~/promo-images/{image.Id}.png?v={image.Version}"),
            ExpirationDate = image.ExpirationDate.ToString("dd.MM.yyyy")
        });
    }

    [HttpGet("GetPromocodesList")]
    public async Task<IActionResult> GetPromocodesList()
    {
        var promocodes = await _dbContext.Images.ToListAsync();
        return Ok(promocodes);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePromo(Guid id, [FromBody] PostImageDto updateDto)
    {
        if (updateDto == null)
            return BadRequest("Invalid data");

        var image = await _dbContext.Images.FindAsync(id);
        if (image == null)
            return NotFound();

        // Обновляем базовые поля
        image.Name = updateDto.Name;
        image.ExpirationDate = updateDto.ExpirationDate;
        image.Version++; 

            // Обновляем изображение с новой датой
            var templatePath = Path.Combine(_env.WebRootPath, "templates", "PromoTemplate.png");
        var finalImagePath = Path.Combine(_env.WebRootPath, "promo-images", $"{image.Id}.png");

        using (var templateStream = System.IO.File.OpenRead(templatePath))
        using (var finalImageStream = System.IO.File.Create(finalImagePath))
        {
            using var templateBitmap = SKBitmap.Decode(templateStream);
            using var canvas = new SKCanvas(templateBitmap);

            // Добавляем QR-код
            var qrCodePath = Path.Combine(_env.WebRootPath, "qr-codes", $"{image.Id}.png");
            using var qrCodeStream = System.IO.File.OpenRead(qrCodePath);
            using var qrCodeBitmap = SKBitmap.Decode(qrCodeStream);

            int qrCodeWidth = 300;
            int qrCodeHeight = 300;
            int qrCodeX = templateBitmap.Width - qrCodeWidth - 115;
            int qrCodeY = (templateBitmap.Height - qrCodeHeight) / 2;

            canvas.DrawBitmap(qrCodeBitmap, new SKRect(qrCodeX, qrCodeY, qrCodeX + qrCodeWidth, qrCodeY + qrCodeHeight));

            // Добавляем текст с новой датой
            var fontPath = Path.Combine(_env.WebRootPath, "fonts", "MYRIADPRO-BOLD.ttf");
            using var fontStream = System.IO.File.OpenRead(fontPath);
            using var typeface = SKTypeface.FromStream(fontStream);

            var textPaint = new SKPaint
            {
                Color = SKColors.Black,
                TextSize = 24,
                IsAntialias = true,
                Typeface = typeface
            };

            string expirationDateText = "*Действителен до: " + updateDto.ExpirationDate.ToString("dd.MM.yyyy");
            float textX = 85;
            float textY = templateBitmap.Height - 220;

            canvas.DrawText(expirationDateText, textX, textY, textPaint);

            // Сохраняем обновленное изображение
            using var finalImage = SKImage.FromBitmap(templateBitmap);
            using var data = finalImage.Encode(SKEncodedImageFormat.Png, 100);
            data.SaveTo(finalImageStream);
        }

        await _dbContext.SaveChangesAsync();
        return Ok(new
        {
            id = image.Id,
            name = image.Name,
            promo = image.Promo,
            qrCodePath = image.QrCodePath,
            finalImagePath = image.FinalImagePath,
            expirationDate = image.ExpirationDate,
            version = image.Version
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePromo(Guid id)
    {
        var image = await _dbContext.Images.FindAsync(id);
        if (image == null)
            return NotFound();

        // Удаляем файлы
        var qrCodePath = Path.Combine(_env.WebRootPath, "qr-codes", $"{id}.png");
        var finalImagePath = Path.Combine(_env.WebRootPath, "promo-images", $"{id}.png");

        if (System.IO.File.Exists(qrCodePath))
            System.IO.File.Delete(qrCodePath);

        if (System.IO.File.Exists(finalImagePath))
            System.IO.File.Delete(finalImagePath);

        // Удаляем запись из БД
        _dbContext.Images.Remove(image);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}