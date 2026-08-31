import { database } from "../db";
import { PromoCode } from "../types";

export const promosController = {
  getPromos() {
    return database.getPromos();
  },

  getFlashPromo() {
    return database.getFlashPromo();
  },

  addPromo(promo: PromoCode) {
    return database.addPromo(promo);
  },

  updatePromo(code: string, updates: Partial<PromoCode>) {
    return database.updatePromo(code, updates);
  },

  deletePromo(code: string) {
    return database.deletePromo(code);
  },

  validatePromo(code: string, subtotal: number) {
    return database.validatePromo(code, subtotal);
  },
};
