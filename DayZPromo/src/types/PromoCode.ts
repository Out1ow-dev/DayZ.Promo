export interface PromoCode {
    id: string;
    name: string;
    promo: string;
    expirationDate: string;
    qrCodePath?: string;
    finalImagePath?: string;
    isActive: boolean;
}

export interface PostImageDto {
    name: string;
    expirationDate: string; // Всегда строка в формате ISO
} 