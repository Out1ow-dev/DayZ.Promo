namespace CrazyDayZ.Promo.Models
{
    public class PromoCode
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Promo { get; set; }
        public string ExpirationDate { get; set; }
        public string QrCodePath { get; set; }
        public string FinalImagePath { get; set; }
    }
} 