import { PromoCode as ApiPromoCode } from '../api/Api';
import { PromoCode } from '../types/PromoCode';

export const mapApiPromoCodeToPromoCode = (apiPromo: ApiPromoCode): PromoCode => ({
    id: apiPromo.id,
    name: apiPromo.name || '',
    promo: apiPromo.promo || '',
    expirationDate: apiPromo.expirationDate,
    finalImagePath: apiPromo.finalImagePath,
    qrCodePath: apiPromo.qrCodePath,
    isActive: true
}); 