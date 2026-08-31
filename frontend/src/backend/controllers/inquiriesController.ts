import { database } from "../db";
import { ContactInquiry } from "../types";

export const inquiriesController = {
  getContacts() {
    return database.getContacts();
  },

  createContact(inquiry: Omit<ContactInquiry, "id" | "createdAt">) {
    return database.createContact(inquiry);
  },

  deleteContact(id: string) {
    return database.deleteContact(id);
  },
};
