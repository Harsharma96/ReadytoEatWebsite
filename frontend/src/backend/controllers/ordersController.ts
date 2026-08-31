import { database } from "../db";
import { Order, OrderStatus } from "../types";

export const ordersController = {
  getAllOrders() {
    return database.getOrders();
  },

  getOrderById(id: string) {
    return database.getOrderById(id);
  },

  createOrder(payload: Omit<Order, "id" | "status" | "statusHistory" | "etaMinutes" | "createdAt" | "courierLocation">) {
    return database.createOrder(payload);
  },

  updateOrderStatus(id: string, newStatus: OrderStatus, note?: string) {
    return database.updateOrderStatus(id, newStatus, note);
  },

  updateOrder(id: string, updates: Partial<Order>) {
    return database.updateOrder(id, updates);
  },

  approveCodPayment(id: string) {
    return database.approveCodPayment(id);
  },

  getArchiveReceipts(days?: number) {
    return database.getArchiveReceipts(days);
  },

  deleteOrder(id: string) {
    return database.deleteOrder(id);
  },
};
