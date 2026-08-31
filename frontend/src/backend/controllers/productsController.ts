import { database } from "../db";
import { Product } from "@/types/product";

export const productsController = {
  getProducts(filters?: { category?: string; search?: string; diet?: string }) {
    return database.getProducts(filters);
  },

  getProductById(id: string) {
    return database.getProductById(id);
  },

  addProduct(product: Product) {
    return database.addProduct(product);
  },

  updateProduct(id: string, updates: Partial<Product>) {
    return database.updateProduct(id, updates);
  },

  deleteProduct(id: string) {
    return database.deleteProduct(id);
  },
};
