namespace CrazyDayZ.Promo.Models;

public class Image
{
    public Guid Id
    {
        get; set;
    }
    public string? Name
    {
        get; set;
    }
    public string? Promo
    {
        get; set;
    }
    public string QrCodePath
    {
        get; set;
    }
    public string FinalImagePath
    {
        get; set;
    }
    public DateTime ExpirationDate
    {
        get; set;
    }
    public int Version { get; set; } = 1; // Добавляем версию
}
