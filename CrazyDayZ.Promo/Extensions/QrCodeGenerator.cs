using System.IO;
using QRCoder;
using QRCoder.Core;
using SkiaSharp;

namespace CrazyDayZ.Promo.Extensions
{
    public static class QrCodeGenerator
    {
        public static string GenerateQrCode(string url, string filePath)
        {
            try
            {
                // Создаем QR-код с использованием библиотеки QRCoder
                using var qrGenerator = new QRCodeGenerator();
                using var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
                using var qrCode = new PngByteQRCode(qrCodeData);

                // Получаем байты PNG изображения
                byte[] qrCodeBytes = qrCode.GetGraphic(20); // 20 - размер одного модуля в пикселях

                // Создаем директорию если её нет
                var directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Сохраняем байты в файл
                File.WriteAllBytes(filePath, qrCodeBytes);

                return filePath;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ошибка при генерации QR кода: {ex.Message}", ex);
            }
        }
    }
}