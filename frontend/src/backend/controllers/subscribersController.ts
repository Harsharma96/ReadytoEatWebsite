import { database } from "../db";

export const subscribersController = {
  getSubscribers() {
    return database.getSubscribers();
  },

  subscribe(email: string) {
    return database.subscribeNewsletter(email);
  },

  deleteSubscriber(email: string) {
    return database.deleteSubscriber(email);
  },
};
