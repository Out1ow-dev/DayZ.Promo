const apiClient = new Client('/api');  // Используем относительный путь 

export interface PromoCode {
    id: string;
    name: string | null;
    promo: string | null;
    qrCodePath: string;
    finalImagePath: string;
    expirationDate: string;
    version: number;
}

export interface PostImageDto {
    name: string;
    expirationDate: Date;
} 