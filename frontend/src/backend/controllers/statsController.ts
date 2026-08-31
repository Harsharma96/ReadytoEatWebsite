import { database } from "../db";

export const statsController = {
  getSystemTelemetry() {
    const stats = database.getStats();
    const orders = database.getOrders();
    const inquiries = database.getContacts();
    const subscribers = database.getSubscribers();
    const promos = database.getPromos();
    const reviews = database.getReviews();

    return {
      stats,
      orders,
      inquiries,
      subscribers,
      promos,
      reviews,
      feastBoxTiers: database.getAllFeastBoxTiers(),
    };
  },
};
