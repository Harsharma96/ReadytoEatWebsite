import fs from "fs";
import path from "path";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { 
  Order, 
  OrderStatus, 
  PromoCode, 
  ContactInquiry, 
  NewsletterSubscriber, 
  FeedbackReview,
  AdminStats,
  FeastBoxTier,
  StoreSettings,
  PaymentTransaction,
  TrendingSpotlightItem,
  MenuCategoryItem,
  ChefSpecialConfig
} from "../types";

interface DatabaseSchema {
  orders: Order[];
  receiptArchive?: PaymentTransaction[];
  customProducts: Product[];
  deletedCatalogProductIds?: string[];
  promoCodes: PromoCode[];
  contactInquiries: ContactInquiry[];
  subscribers: NewsletterSubscriber[];
  reviews?: FeedbackReview[];
  feastBoxTiers?: FeastBoxTier[];
  settings?: StoreSettings;
  trendingSpotlights?: TrendingSpotlightItem[];
  categories?: MenuCategoryItem[];
  chefSpecial?: ChefSpecialConfig;
}

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  gstPercent: 5,
  isGstEnabled: true,
  taxName: "GST (CGST 2.5% + SGST 2.5%)",
  freeDeliveryThreshold: 499,
  standardDeliveryFee: 49,
  isFreeDeliveryEnabled: true,
  restaurantGstin: "07AABCF1234F1Z8",
  fssaiNumber: "10020011005829",
};

const DEFAULT_CHEF_SPECIAL: ChefSpecialConfig = {
  id: "chef-special-default",
  productId: "double-smash-cheese-burger",
  badgeText: "👑 ROYAL CHEF SPECIAL OF THE MONTH",
  customTitle: "Nawabi Awadhi Zafrani Handi Dum Biryani",
  customDescription: "Curated by Master Ustads of Lucknow. Prime cuts of tender lamb marinated for 48 hours in stone-ground Awadhi spices, layered with aged Basmati rice, infused with Kashmiri saffron milk, and sealed in clay handi for 4 hours of slow charcoal dum cooking.",
  heritageTag: "Awadh Royals",
  slowCookingTag: "4-Hr Clay Dum",
  dailyBatchTag: "Only 40 Handis",
  customPrice: 549,
  customImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
  customImages: [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop"
  ],
  isActive: true,
  buttonText: "Reserve Royal Handi",
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    code: "DESI20",
    discountPercent: 20,
    minSpend: 499,
    description: "20% OFF on Shahi Royal Feast orders",
    isActive: true,
  },
  {
    code: "TAJ100",
    fixedDiscount: 100,
    minSpend: 599,
    description: "₹100 Flat OFF for Royal Food Lovers",
    isActive: true,
  },
  {
    code: "MAHARAJA25",
    discountPercent: 25,
    minSpend: 999,
    description: "25% OFF on Grand Dawat Box bundles",
    isActive: true,
  },
];

const DEFAULT_REVIEWS: FeedbackReview[] = [
  {
    id: "REV-101",
    orderId: "FE-82910",
    customerName: "Raja Vikramaditya Singhania",
    rating: 5,
    moodEmoji: "👑",
    deliveryRating: 5,
    tasteRating: 5,
    favoriteDish: "Shahi Awadhi Dum Gosht Biryani",
    tags: ["Mind Blowing Saffron", "Tender Lamb", "25-Min Thermal Delivery"],
    comment: "The Awadhi Dum Biryani arrived steaming hot in a sealed clay handi! The aroma of Kashmiri saffron filled the room. Truly a royal 5-star experience.",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    verified: true,
  },
  {
    id: "REV-102",
    orderId: "FE-73819",
    customerName: "Ananya Deshmukh",
    rating: 5,
    moodEmoji: "😋",
    deliveryRating: 5,
    tasteRating: 5,
    favoriteDish: "Double Melt Gourmet Smash Cheese Burger",
    tags: ["Super Juicy", "Molten Cheddar", "Ultra Crispy Fries"],
    comment: "Best smash burger in town! The brioche was perfectly toasted, and the melted cheddar pull was insane. Peri-peri fries were still hot and crunchy!",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    verified: true,
  },
  {
    id: "REV-103",
    orderId: "FE-64920",
    customerName: "Kavita & Rajesh Patel",
    rating: 5,
    moodEmoji: "👑",
    deliveryRating: 5,
    tasteRating: 5,
    favoriteDish: "Royal Kathiyawadi Grand Gujarati Thali",
    tags: ["Authentic Surti Taste", "Pure Desi Ghee", "Soft Dhokla"],
    comment: "Ghar jaisa authentic swaad! Surti Undhiyu and thepla were cooked to perfection in pure cow ghee. The Kesar Shrikhand was sublime.",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    verified: true,
  },
  {
    id: "REV-104",
    orderId: "FE-55201",
    customerName: "Devansh Mehra",
    rating: 5,
    moodEmoji: "🍫",
    deliveryRating: 5,
    tasteRating: 5,
    favoriteDish: "Warm Molten Belgian Choco Lava Cake",
    tags: ["Erupting Fudge Core", "Belgian Chocolate", "Iced Cold Coffee"],
    comment: "The chocolate lava cake literally erupted warm gooey truffle ganache at the touch of a spoon. Paired with iced caramel macchiato, it was pure bliss.",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    verified: true,
  },
];

const DEFAULT_FEAST_BOX_TIERS: FeastBoxTier[] = [
  {
    id: "tier-4",
    count: 4,
    title: "Shahi Mini Feast (4 Dishes)",
    discountPercent: 15,
    badge: "15% OFF",
    gift: "Complimentary Kesar Matka Lassi",
    freeGifts: ["15% Instant Dawat Discount", "Complimentary Kesar Matka Lassi", "Free Thermal Pod Delivery"],
    isActive: true,
  },
  {
    id: "tier-6",
    count: 6,
    title: "Maharaja Royal Box (6 Dishes)",
    discountPercent: 20,
    badge: "MOST POPULAR • 20% OFF",
    gift: "Free 24K Gold Gulab Jamun Set",
    freeGifts: ["20% Instant Dawat Discount", "Free 24K Gold Gulab Jamun Set", "Priority 25-Min Thermal Transit"],
    isActive: true,
  },
  {
    id: "tier-8",
    count: 8,
    title: "Nawabi Grand Dawat (8 Dishes)",
    discountPercent: 25,
    badge: "BEST VALUE • 25% OFF",
    gift: "Free Garlic Naan Basket + Saffron Rabdi",
    freeGifts: ["25% Maximum Royal Discount", "Free Garlic Naan Basket + Saffron Rabdi", "VIP Master Chef Concierge"],
    isActive: true,
  },
];

const DEFAULT_TRENDING_SPOTLIGHTS: TrendingSpotlightItem[] = [
  {
    id: "trend-1",
    productId: PRODUCTS[0]?.id || "1",
    customOfferTag: "🔥 TODAY'S SPECIAL: FLAT 20% OFF",
    offerBadge: "CHEF TOP PICK",
    priority: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-2",
    productId: PRODUCTS[1]?.id || "2",
    customOfferTag: "👑 FREE GULAB JAMUN WITH THIS ORDER",
    offerBadge: "ROYAL DEAL",
    priority: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-3",
    productId: PRODUCTS[2]?.id || "3",
    customOfferTag: "⚡ BUY 1 GET 1 DRINK FREE",
    offerBadge: "BESTSELLER",
    priority: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-4",
    productId: PRODUCTS[3]?.id || "4",
    customOfferTag: "🍲 SLOW COOKED IN 100% PURE COW GHEE",
    offerBadge: "HOT TRENDING",
    priority: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_MENU_CATEGORIES: MenuCategoryItem[] = [
  {
    id: "cat-burgers",
    name: "Burgers & Wraps",
    emoji: "🍔",
    subtitle: "Smash & Crispy",
    bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
    borderColor: "border-[#FF6B35]/40",
    accent: "#FF6B35",
    priority: 1,
    isActive: true,
  },
  {
    id: "cat-pizzas",
    name: "Pizzas & Garlic Breads",
    emoji: "🍕",
    subtitle: "Cheese Burst",
    bgGradient: "from-[#FFE8EC] to-[#FFD5DC]",
    borderColor: "border-[#FF4D6D]/40",
    accent: "#FF4D6D",
    priority: 2,
    isActive: true,
  },
  {
    id: "cat-snacks",
    name: "Snacks & Chaat",
    emoji: "🍟",
    subtitle: "Peri Fries & Chaat",
    bgGradient: "from-[#FFF4E5] to-[#FFE6CC]",
    borderColor: "border-[#FF8A00]/40",
    accent: "#FF8A00",
    priority: 3,
    isActive: true,
  },
  {
    id: "cat-chinese",
    name: "Chinese & Momos",
    emoji: "🥢",
    subtitle: "Noodles & Dim Sum",
    bgGradient: "from-[#FFF2EB] to-[#FCD1B8]",
    borderColor: "border-[#E85620]/40",
    accent: "#E85620",
    priority: 4,
    isActive: true,
  },
  {
    id: "cat-biryani",
    name: "Biryani & North Indian",
    emoji: "🍚",
    subtitle: "Dum & Butter Curry",
    bgGradient: "from-[#FFFBF5] to-[#EFE1CE]",
    borderColor: "border-[#D4A373]/40",
    accent: "#D4A373",
    priority: 5,
    isActive: true,
  },
  {
    id: "cat-gujarati",
    name: "Gujarati & Thalis",
    emoji: "🟡",
    subtitle: "Undhiyu & Dhokla",
    bgGradient: "from-[#FFF9E6] to-[#FFEAB3]",
    borderColor: "border-[#FFC94A]/50",
    accent: "#FFC94A",
    priority: 6,
    isActive: true,
  },
  {
    id: "cat-south-indian",
    name: "South Indian",
    emoji: "🥥",
    subtitle: "Ghee Dosa & Idli",
    bgGradient: "from-[#EAF9EF] to-[#D5F5E0]",
    borderColor: "border-[#3ECF6E]/40",
    accent: "#3ECF6E",
    priority: 7,
    isActive: true,
  },
  {
    id: "cat-chai",
    name: "Chai, Coffee & Juices",
    emoji: "☕",
    subtitle: "Kulhad & Shakes",
    bgGradient: "from-[#F0FDF4] to-[#DCFCE7]",
    borderColor: "border-[#22C55E]/40",
    accent: "#22C55E",
    priority: 8,
    isActive: true,
  },
  {
    id: "cat-desserts",
    name: "Desserts & Shakes",
    emoji: "🍰",
    subtitle: "Choco Lava & Mithai",
    bgGradient: "from-[#FFF8F2] to-[#F5D8BF]",
    borderColor: "border-[#E0A96D]/40",
    accent: "#E0A96D",
    priority: 9,
    isActive: true,
  },
];

function initDB(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      orders: [],
      customProducts: [],
      deletedCatalogProductIds: [],
      promoCodes: DEFAULT_PROMO_CODES,
      contactInquiries: [],
      subscribers: [],
      reviews: DEFAULT_REVIEWS,
      feastBoxTiers: DEFAULT_FEAST_BOX_TIERS,
      trendingSpotlights: DEFAULT_TRENDING_SPOTLIGHTS,
      categories: DEFAULT_MENU_CATEGORIES,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.customProducts) parsed.customProducts = [];
    if (!parsed.deletedCatalogProductIds) parsed.deletedCatalogProductIds = [];
    if (!parsed.promoCodes) parsed.promoCodes = DEFAULT_PROMO_CODES;
    if (!parsed.reviews || parsed.reviews.length === 0) parsed.reviews = DEFAULT_REVIEWS;
    if (!parsed.feastBoxTiers || parsed.feastBoxTiers.length === 0) parsed.feastBoxTiers = DEFAULT_FEAST_BOX_TIERS;
    if (!parsed.trendingSpotlights || parsed.trendingSpotlights.length === 0) parsed.trendingSpotlights = DEFAULT_TRENDING_SPOTLIGHTS;
    if (!parsed.categories || parsed.categories.length === 0) parsed.categories = DEFAULT_MENU_CATEGORIES;
    return parsed;
  } catch (err) {
    console.error("Error reading backend database, reinitializing:", err);
    const fallback: DatabaseSchema = {
      orders: [],
      customProducts: [],
      deletedCatalogProductIds: [],
      promoCodes: DEFAULT_PROMO_CODES,
      contactInquiries: [],
      subscribers: [],
      reviews: DEFAULT_REVIEWS,
      feastBoxTiers: DEFAULT_FEAST_BOX_TIERS,
      trendingSpotlights: DEFAULT_TRENDING_SPOTLIGHTS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

function saveDB(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const database = {
  // ==================== ORDERS ====================
  getOrders(): Order[] {
    const data = initDB();
    return (data.orders || [])
      .filter((o) => !o.isArchived)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrderById(id: string): Order | undefined {
    const data = initDB();
    return (data.orders || []).find((o) => o.id.toLowerCase() === id.toLowerCase());
  },

  createOrder(payload: Omit<Order, "id" | "status" | "statusHistory" | "etaMinutes" | "createdAt" | "courierLocation">): Order {
    const data = initDB();
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `FE-${orderNumber}`;
    const now = new Date().toISOString();
    const isCod = payload.paymentMethod?.toLowerCase().includes("cod") || payload.paymentMethod?.toLowerCase().includes("cash");
    const paymentStatus = isCod ? "PENDING_COD" : "PAID";

    const newOrder: Order = {
      ...payload,
      id: orderId,
      paymentStatus: payload.paymentStatus || paymentStatus,
      status: "ORDER_RECEIVED",
      statusHistory: [
        {
          status: "ORDER_RECEIVED",
          timestamp: now,
          note: isCod ? "Order placed via Cash on Delivery. Payment pending upon delivery." : "Order confirmed & payment verified via Instant Gateway.",
        },
      ],
      etaMinutes: 22,
      createdAt: now,
      courierLocation: {
        lat: 28.6139,
        lng: 77.2090,
        name: "Rameshwar Sharma (Desi Electric Thermal Pod #09)",
        vehicle: "Electric Thermal Bike #09 (Connaught Place Hub)",
      },
    };

    if (!data.orders) data.orders = [];
    data.orders.unshift(newOrder);

    // Save permanently to receiptArchive for 7+ days sales reporting even if active ticket is deleted
    if (!data.receiptArchive) data.receiptArchive = [];
    const itemsSummary = (newOrder.items || []).map((i) => `${i.quantity}x ${i.name}`).join(", ");
    data.receiptArchive.unshift({
      id: `TXN-${orderId.replace(/[^a-zA-Z0-9]/g, "")}`,
      orderId: orderId,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      paymentMethod: newOrder.paymentMethod,
      subtotal: newOrder.subtotal,
      taxAmount: newOrder.tax || 0,
      discountAmount: newOrder.discount || 0,
      deliveryFee: newOrder.deliveryFee || 0,
      totalAmount: newOrder.total,
      paymentStatus: paymentStatus,
      transactionRef: `${isCod ? "COD-COLLECT" : "UPI-GATEWAY"}-${orderId.slice(-5)}-${Date.now().toString().slice(-4)}`,
      itemsSummary: itemsSummary,
      createdAt: now,
      paidAt: paymentStatus === "PAID" ? now : undefined,
    });

    saveDB(data);
    return newOrder;
  },

  approveCodPayment(id: string): { success: boolean; order?: Order; message: string } {
    const data = initDB();
    const order = (data.orders || []).find((o) => o.id.toLowerCase() === id.toLowerCase());
    const now = new Date().toISOString();

    if (order) {
      order.paymentStatus = "PAID";
      order.statusHistory.push({
        status: order.status,
        timestamp: now,
        note: "💵 Cash on Delivery payment received & approved by Admin.",
      });
    }

    if (data.receiptArchive) {
      const txn = data.receiptArchive.find((t) => t.orderId.toLowerCase() === id.toLowerCase());
      if (txn) {
        txn.paymentStatus = "PAID";
        txn.paidAt = now;
      }
    }

    saveDB(data);
    return { 
      success: true, 
      order, 
      message: `Cash on Delivery payment for Order #${id} approved successfully!` 
    };
  },

  updateOrderStatus(id: string, newStatus: OrderStatus, note?: string): Order | null {
    const data = initDB();
    const orderIndex = (data.orders || []).findIndex((o) => o.id.toLowerCase() === id.toLowerCase());
    if (orderIndex === -1) return null;

    const order = data.orders[orderIndex];
    order.status = newStatus;
    const now = new Date().toISOString();
    order.statusHistory.push({
      status: newStatus,
      timestamp: now,
      note: note || `Status updated to ${newStatus}`,
    });

    // If delivered and was COD, automatically mark payment approved if not already
    const isCod = order.paymentMethod?.toLowerCase().includes("cod") || order.paymentMethod?.toLowerCase().includes("cash");
    if (newStatus === "DELIVERED" && isCod) {
      order.paymentStatus = "PAID";
      if (data.receiptArchive) {
        const txn = data.receiptArchive.find((t) => t.orderId.toLowerCase() === id.toLowerCase());
        if (txn) {
          txn.paymentStatus = "PAID";
          txn.paidAt = now;
        }
      }
    }

    data.orders[orderIndex] = order;
    saveDB(data);
    return order;
  },

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const data = initDB();
    const idx = (data.orders || []).findIndex((o) => o.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;

    data.orders[idx] = { ...data.orders[idx], ...updates };
    saveDB(data);
    return data.orders[idx];
  },

  deleteOrder(id: string): boolean {
    const data = initDB();
    const initialLen = (data.orders || []).length;
    // Safe deletion: remove from active kitchen tickets, while keeping receipt in receiptArchive
    data.orders = (data.orders || []).filter((o) => o.id.toLowerCase() !== id.toLowerCase());
    if (data.orders.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== REVIEWS & FEEDBACK ====================
  getReviews(): FeedbackReview[] {
    const data = initDB();
    return (data.reviews || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createReview(review: Omit<FeedbackReview, "id" | "createdAt" | "verified">): FeedbackReview {
    const data = initDB();
    const newRev: FeedbackReview = {
      ...review,
      id: `REV-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      verified: true,
    };

    if (!data.reviews) data.reviews = [];
    data.reviews.unshift(newRev);

    // If orderId is attached, mark order as feedbackSubmitted
    if (review.orderId && data.orders) {
      const orderIdx = data.orders.findIndex((o) => o.id === review.orderId);
      if (orderIdx !== -1) {
        data.orders[orderIdx].feedbackSubmitted = true;
      }
    }

    saveDB(data);
    return newRev;
  },

  deleteReview(id: string): boolean {
    const data = initDB();
    const initialLen = (data.reviews || []).length;
    data.reviews = (data.reviews || []).filter((r) => r.id !== id);
    if (data.reviews.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== PRODUCTS / MENU ====================
  getProducts(filters?: { category?: string; search?: string; diet?: string }): Product[] {
    const data = initDB();
    const deletedIds = new Set(data.deletedCatalogProductIds || []);
    
    const activeBase = PRODUCTS.filter((p) => !deletedIds.has(p.id));
    let result = [...(data.customProducts || []), ...activeBase];

    if (filters?.category && filters.category !== "All Dishes") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters?.diet && filters.diet !== "All") {
      result = result.filter((p) => p.dietary.includes(filters.diet as any));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  },

  addProduct(product: Product): Product {
    const data = initDB();
    if (!data.customProducts) data.customProducts = [];
    data.customProducts.unshift(product);
    saveDB(data);
    return product;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const data = initDB();
    const customIdx = (data.customProducts || []).findIndex((p) => p.id === id);
    if (customIdx !== -1) {
      data.customProducts[customIdx] = { ...data.customProducts[customIdx], ...updates };
      saveDB(data);
      return data.customProducts[customIdx];
    }

    const baseProduct = PRODUCTS.find((p) => p.id === id);
    if (baseProduct) {
      if (!data.deletedCatalogProductIds) data.deletedCatalogProductIds = [];
      data.deletedCatalogProductIds.push(id);
      
      const updatedProduct: Product = { ...baseProduct, ...updates };
      if (!data.customProducts) data.customProducts = [];
      data.customProducts.unshift(updatedProduct);
      saveDB(data);
      return updatedProduct;
    }

    return null;
  },

  deleteProduct(id: string): boolean {
    const data = initDB();
    let changed = false;

    if (data.customProducts && data.customProducts.some((p) => p.id === id)) {
      data.customProducts = data.customProducts.filter((p) => p.id !== id);
      changed = true;
    }

    if (PRODUCTS.some((p) => p.id === id)) {
      if (!data.deletedCatalogProductIds) data.deletedCatalogProductIds = [];
      if (!data.deletedCatalogProductIds.includes(id)) {
        data.deletedCatalogProductIds.push(id);
        changed = true;
      }
    }

    if (changed) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== PROMO CODES ====================
  getPromos(): PromoCode[] {
    const data = initDB();
    return data.promoCodes || [];
  },

  getFlashPromo(): PromoCode | null {
    const data = initDB();
    const activePromos = (data.promoCodes || []).filter((p) => p.isActive);
    if (activePromos.length === 0) return null;

    // First check if one is explicitly marked as isFlashBanner
    const flash = activePromos.find((p) => p.isFlashBanner);
    if (flash) return flash;

    // Otherwise return first active promo
    return activePromos[0] || null;
  },

  addPromo(promo: PromoCode): PromoCode {
    const data = initDB();
    const cleanCode = promo.code.trim().toUpperCase();
    const existingIdx = (data.promoCodes || []).findIndex((p) => p.code === cleanCode);
    const formatted = { 
      ...promo, 
      code: cleanCode, 
      isActive: promo.isActive !== undefined ? promo.isActive : true,
      title: promo.title || `Unlock ${promo.discountPercent ? `${promo.discountPercent}% Off` : `₹${promo.fixedDiscount} Off`} on Royal Feast`,
      badgeText: promo.badgeText || "👑 LIMITED SHAHI RASOI OFFER",
      freeItem: promo.freeItem || "2 Free 24K Gold Gulab Jamuns",
      isFlashBanner: promo.isFlashBanner ?? false,
    };

    if (!data.promoCodes) data.promoCodes = [];

    // If this promo is set to isFlashBanner, unset it from others
    if (formatted.isFlashBanner) {
      data.promoCodes.forEach((p) => {
        if (p.code !== cleanCode) p.isFlashBanner = false;
      });
    }

    if (existingIdx >= 0) {
      data.promoCodes[existingIdx] = formatted;
    } else {
      data.promoCodes.unshift(formatted);
    }
    saveDB(data);
    return formatted;
  },

  updatePromo(code: string, updates: Partial<PromoCode>): PromoCode | null {
    const data = initDB();
    const cleanCode = code.trim().toUpperCase();
    const idx = (data.promoCodes || []).findIndex((p) => p.code === cleanCode);
    if (idx === -1) return null;

    if (updates.isFlashBanner) {
      data.promoCodes.forEach((p) => {
        if (p.code !== cleanCode) p.isFlashBanner = false;
      });
    }

    data.promoCodes[idx] = { ...data.promoCodes[idx], ...updates };
    saveDB(data);
    return data.promoCodes[idx];
  },

  deletePromo(code: string): boolean {
    const data = initDB();
    const cleanCode = code.trim().toUpperCase();
    const initialLen = (data.promoCodes || []).length;
    data.promoCodes = (data.promoCodes || []).filter((p) => p.code !== cleanCode);
    if (data.promoCodes.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  validatePromo(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const data = initDB();
    const found = (data.promoCodes || []).find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive
    );

    if (!found) {
      return { valid: false, discount: 0, message: "Invalid promo code" };
    }

    if (subtotal < found.minSpend) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order of ₹${found.minSpend} required for code ${found.code}`,
      };
    }

    let discount = 0;
    if (found.discountPercent) {
      discount = (subtotal * found.discountPercent) / 100;
    } else if (found.fixedDiscount) {
      discount = Math.min(found.fixedDiscount, subtotal);
    }

    return {
      valid: true,
      discount: Math.round(discount * 100) / 100,
      message: found.description,
    };
  },

  // ==================== CONTACT INQUIRIES ====================
  getContacts(): ContactInquiry[] {
    const data = initDB();
    return data.contactInquiries || [];
  },

  createContact(inquiry: Omit<ContactInquiry, "id" | "createdAt">): ContactInquiry {
    const data = initDB();
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `INQ-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    if (!data.contactInquiries) data.contactInquiries = [];
    data.contactInquiries.unshift(newInquiry);
    saveDB(data);
    return newInquiry;
  },

  deleteContact(id: string): boolean {
    const data = initDB();
    const initialLen = (data.contactInquiries || []).length;
    data.contactInquiries = (data.contactInquiries || []).filter((c) => c.id !== id);
    if (data.contactInquiries.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== NEWSLETTER SUBSCRIBERS ====================
  getSubscribers(): NewsletterSubscriber[] {
    const data = initDB();
    return data.subscribers || [];
  },

  subscribeNewsletter(email: string): { success: boolean; promoIssued: string; message: string } {
    const data = initDB();
    const normalized = email.trim().toLowerCase();
    if (!data.subscribers) data.subscribers = [];
    const existing = data.subscribers.find((s) => s.email === normalized);

    const activePromo = (data.promoCodes || []).find((p) => p.isActive);
    const promoCode = activePromo ? activePromo.code : "VIPFEAST";

    if (existing) {
      return {
        success: true,
        promoIssued: existing.promoIssued,
        message: `You're already subscribed! Use code ${existing.promoIssued} for your VIP feast.`,
      };
    }

    const subscriber: NewsletterSubscriber = {
      email: normalized,
      subscribedAt: new Date().toISOString(),
      promoIssued: promoCode,
    };

    data.subscribers.unshift(subscriber);
    saveDB(data);

    return {
      success: true,
      promoIssued: promoCode,
      message: `Welcome to FoodEat VIP Club! ${activePromo ? `Use code ${promoCode} for your discount.` : "VIP status activated!"}`,
    };
  },

  deleteSubscriber(email: string): boolean {
    const data = initDB();
    const normalized = email.trim().toLowerCase();
    const initialLen = (data.subscribers || []).length;
    data.subscribers = (data.subscribers || []).filter((s) => s.email.toLowerCase() !== normalized);
    if (data.subscribers.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== TELEMETRY & STATS ====================
  getStats(): AdminStats {
    const data = initDB();
    const orders = data.orders || [];
    const reviews = data.reviews || [];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeOrders = orders.filter((o) => o.status !== "DELIVERED").length;
    const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;
    const aov = orders.length > 0 ? totalRevenue / orders.length : 0;
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 4.98;

    return {
      totalOrders: orders.length,
      activeOrders,
      completedOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round(aov * 100) / 100,
      totalSubscribers: data.subscribers?.length || 0,
      totalInquiries: data.contactInquiries?.length || 0,
      totalPromos: data.promoCodes?.length || 0,
      totalReviews: reviews.length,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  },

  // ==================== FEAST BOX TIERS ====================
  getFeastBoxTiers(): FeastBoxTier[] {
    const data = initDB();
    return (data.feastBoxTiers || DEFAULT_FEAST_BOX_TIERS).filter((t) => t.isActive !== false);
  },

  getAllFeastBoxTiers(): FeastBoxTier[] {
    const data = initDB();
    return data.feastBoxTiers || DEFAULT_FEAST_BOX_TIERS;
  },

  getFeastBoxTierById(id: string): FeastBoxTier | undefined {
    const data = initDB();
    const tiers = data.feastBoxTiers || DEFAULT_FEAST_BOX_TIERS;
    return tiers.find((t) => t.id === id);
  },

  addFeastBoxTier(tier: { count: number; title?: string; discountPercent: number; badge?: string; gift?: string; freeGifts?: string[] }): FeastBoxTier {
    const data = initDB();
    if (!data.feastBoxTiers) data.feastBoxTiers = [...DEFAULT_FEAST_BOX_TIERS];
    
    const countNum = Number(tier.count);
    const discNum = Number(tier.discountPercent);
    const newTier: FeastBoxTier = {
      id: `tier-${countNum}-${Date.now().toString().slice(-4)}`,
      count: countNum,
      title: tier.title || `Royal Feast Box (${countNum} Dishes)`,
      discountPercent: discNum,
      badge: tier.badge || `${discNum}% OFF`,
      gift: tier.gift || "Complimentary Chef Special Dessert",
      freeGifts: Array.isArray(tier.freeGifts) && tier.freeGifts.length > 0
        ? tier.freeGifts 
        : [`${discNum}% Instant Royal Discount`, "Complimentary Surprise Dish", "Free Thermal Pod Delivery"],
      isActive: true,
    };

    data.feastBoxTiers.push(newTier);
    saveDB(data);
    return newTier;
  },

  updateFeastBoxTier(id: string, updates: Partial<FeastBoxTier>): FeastBoxTier | null {
    const data = initDB();
    if (!data.feastBoxTiers) data.feastBoxTiers = [...DEFAULT_FEAST_BOX_TIERS];
    const index = data.feastBoxTiers.findIndex((t) => t.id === id);
    if (index === -1) return null;

    data.feastBoxTiers[index] = {
      ...data.feastBoxTiers[index],
      ...updates,
      count: updates.count !== undefined ? Number(updates.count) : data.feastBoxTiers[index].count,
      discountPercent: updates.discountPercent !== undefined ? Number(updates.discountPercent) : data.feastBoxTiers[index].discountPercent,
    };
    saveDB(data);
    return data.feastBoxTiers[index];
  },

  deleteFeastBoxTier(id: string): boolean {
    const data = initDB();
    if (!data.feastBoxTiers) data.feastBoxTiers = [...DEFAULT_FEAST_BOX_TIERS];
    const initialLen = data.feastBoxTiers.length;
    data.feastBoxTiers = data.feastBoxTiers.filter((t) => t.id !== id);
    if (data.feastBoxTiers.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== STORE & GST SETTINGS ====================
  getSettings(): StoreSettings {
    const data = initDB();
    return data.settings || DEFAULT_STORE_SETTINGS;
  },

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    const data = initDB();
    data.settings = {
      ...(data.settings || DEFAULT_STORE_SETTINGS),
      ...updates,
      gstPercent: updates.gstPercent !== undefined ? Number(updates.gstPercent) : (data.settings?.gstPercent ?? DEFAULT_STORE_SETTINGS.gstPercent),
      freeDeliveryThreshold: updates.freeDeliveryThreshold !== undefined ? Number(updates.freeDeliveryThreshold) : (data.settings?.freeDeliveryThreshold ?? DEFAULT_STORE_SETTINGS.freeDeliveryThreshold),
      standardDeliveryFee: updates.standardDeliveryFee !== undefined ? Number(updates.standardDeliveryFee) : (data.settings?.standardDeliveryFee ?? DEFAULT_STORE_SETTINGS.standardDeliveryFee),
    };
    saveDB(data);
    return data.settings;
  },

  // ==================== PAYMENT TRANSACTIONS & 7-DAY ARCHIVE ====================
  getTransactions(): PaymentTransaction[] {
    const data = initDB();
    const archive = data.receiptArchive || [];
    const activeOrders = data.orders || [];

    // Combine archive records with active orders, eliminating duplicates by orderId
    const map = new Map<string, PaymentTransaction>();

    // 1. Add from permanent archive
    archive.forEach((t) => {
      map.set(t.orderId, t);
    });

    // 2. Add or sync from active orders
    activeOrders.forEach((o) => {
      const isCod = o.paymentMethod?.toLowerCase() === "cod" || o.paymentMethod?.toLowerCase() === "cash";
      let paymentStatus: "PAID" | "PENDING" | "PENDING_COD" | "REFUNDED" | "CANCELLED" = 
        o.paymentStatus || (isCod ? (o.status === "DELIVERED" ? "PAID" : "PENDING_COD") : "PAID");
      
      const itemsSummary = (o.items || []).map((i) => `${i.quantity}x ${i.name}`).join(", ");
      
      const existing = map.get(o.id);
      if (existing) {
        map.set(o.id, {
          ...existing,
          customerName: o.customerName,
          phone: o.phone,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus || existing.paymentStatus,
          totalAmount: o.total,
          itemsSummary: itemsSummary || existing.itemsSummary,
        });
      } else {
        map.set(o.id, {
          id: `TXN-${o.id.replace(/[^a-zA-Z0-9]/g, "")}`,
          orderId: o.id,
          customerName: o.customerName,
          phone: o.phone,
          paymentMethod: o.paymentMethod,
          subtotal: o.subtotal,
          taxAmount: o.tax || 0,
          discountAmount: o.discount || 0,
          deliveryFee: o.deliveryFee || 0,
          totalAmount: o.total,
          paymentStatus,
          transactionRef: `${isCod ? "COD-COLLECT" : "UPI-GATEWAY"}-${o.id.slice(-5)}-${Date.now().toString().slice(-4)}`,
          itemsSummary: itemsSummary,
          createdAt: o.createdAt,
          paidAt: paymentStatus === "PAID" ? o.createdAt : undefined,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getArchiveReceipts(days = 7): PaymentTransaction[] {
    const all = this.getTransactions();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return all.filter((t) => new Date(t.createdAt).getTime() >= cutoff);
  },

  deleteTransaction(orderId: string): boolean {
    const data = initDB();
    let changed = false;
    if (data.orders) {
      const initLen = data.orders.length;
      data.orders = data.orders.filter((o) => o.id !== orderId);
      if (data.orders.length < initLen) changed = true;
    }
    if (data.receiptArchive) {
      const initLen = data.receiptArchive.length;
      data.receiptArchive = data.receiptArchive.filter((t) => t.orderId !== orderId);
      if (data.receiptArchive.length < initLen) changed = true;
    }
    if (changed) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== TRENDING SPOTLIGHTS & OFFERS ====================
  getTrendingSpotlights(): TrendingSpotlightItem[] {
    const data = initDB();
    const allProducts = this.getProducts();
    const spotlights = (data.trendingSpotlights || DEFAULT_TRENDING_SPOTLIGHTS).filter((s) => s.isActive !== false);

    return spotlights.map((s) => {
      const prod = allProducts.find((p) => p.id.toString() === s.productId.toString());
      return {
        ...s,
        product: prod || allProducts[0],
      };
    }).sort((a, b) => (a.priority || 0) - (b.priority || 0));
  },

  getAllTrendingSpotlightsForAdmin(): TrendingSpotlightItem[] {
    const data = initDB();
    const allProducts = this.getProducts();
    const spotlights = data.trendingSpotlights || DEFAULT_TRENDING_SPOTLIGHTS;

    return spotlights.map((s) => {
      const prod = allProducts.find((p) => p.id.toString() === s.productId.toString());
      return {
        ...s,
        product: prod || allProducts[0],
      };
    }).sort((a, b) => (a.priority || 0) - (b.priority || 0));
  },

  addTrendingSpotlight(payload: Omit<TrendingSpotlightItem, "id" | "createdAt">): TrendingSpotlightItem {
    const data = initDB();
    if (!data.trendingSpotlights) data.trendingSpotlights = DEFAULT_TRENDING_SPOTLIGHTS;

    const newItem: TrendingSpotlightItem = {
      ...payload,
      id: `trend-${Date.now()}`,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      createdAt: new Date().toISOString(),
    };

    data.trendingSpotlights.push(newItem);
    saveDB(data);
    return newItem;
  },

  updateTrendingSpotlight(id: string, updates: Partial<TrendingSpotlightItem>): TrendingSpotlightItem | null {
    const data = initDB();
    if (!data.trendingSpotlights) data.trendingSpotlights = DEFAULT_TRENDING_SPOTLIGHTS;

    const index = data.trendingSpotlights.findIndex((s) => s.id === id);
    if (index === -1) return null;

    data.trendingSpotlights[index] = {
      ...data.trendingSpotlights[index],
      ...updates,
    };

    saveDB(data);
    return data.trendingSpotlights[index];
  },

  deleteTrendingSpotlight(id: string): boolean {
    const data = initDB();
    if (!data.trendingSpotlights) data.trendingSpotlights = DEFAULT_TRENDING_SPOTLIGHTS;

    const initialLen = data.trendingSpotlights.length;
    data.trendingSpotlights = data.trendingSpotlights.filter((s) => s.id !== id);
    if (data.trendingSpotlights.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== MENU CATEGORIES MANAGEMENT ====================
  getCategories(): MenuCategoryItem[] {
    const data = initDB();
    const categories = data.categories || DEFAULT_MENU_CATEGORIES;
    return categories
      .filter((c) => c.isActive !== false)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  },

  getAllCategoriesForAdmin(): MenuCategoryItem[] {
    const data = initDB();
    const categories = data.categories || DEFAULT_MENU_CATEGORIES;
    return [...categories].sort((a, b) => (a.priority || 0) - (b.priority || 0));
  },

  addCategory(payload: Omit<MenuCategoryItem, "id" | "createdAt">): MenuCategoryItem {
    const data = initDB();
    if (!data.categories) data.categories = [...DEFAULT_MENU_CATEGORIES];

    const newCat: MenuCategoryItem = {
      ...payload,
      id: `cat-${Date.now()}`,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      priority: payload.priority || data.categories.length + 1,
      createdAt: new Date().toISOString(),
    };

    data.categories.push(newCat);
    saveDB(data);
    return newCat;
  },

  updateCategory(id: string, updates: Partial<MenuCategoryItem>): MenuCategoryItem | null {
    const data = initDB();
    if (!data.categories) data.categories = [...DEFAULT_MENU_CATEGORIES];

    const index = data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const oldName = data.categories[index].name;

    data.categories[index] = {
      ...data.categories[index],
      ...updates,
      priority: updates.priority !== undefined ? Number(updates.priority) : data.categories[index].priority,
    };

    // If category name was renamed, cascade update to custom products
    if (updates.name && updates.name.trim() !== oldName && data.customProducts) {
      const newName = updates.name.trim();
      data.customProducts = data.customProducts.map((p) =>
        p.category === oldName ? { ...p, category: newName as any } : p
      );
    }

    saveDB(data);
    return data.categories[index];
  },

  deleteCategory(id: string): boolean {
    const data = initDB();
    if (!data.categories) data.categories = [...DEFAULT_MENU_CATEGORIES];

    const initialLen = data.categories.length;
    data.categories = data.categories.filter((c) => c.id !== id);
    if (data.categories.length < initialLen) {
      saveDB(data);
      return true;
    }
    return false;
  },

  // ==================== CHEF SPECIAL SPOTLIGHT ====================
  getChefSpecial(): ChefSpecialConfig | null {
    const data = initDB();
    const allProducts = this.getProducts();
    const special = data.chefSpecial !== undefined ? data.chefSpecial : DEFAULT_CHEF_SPECIAL;
    if (!special) return null;
    const prod = allProducts.find((p) => p.id.toString() === special.productId?.toString()) || allProducts[0];
    return {
      ...special,
      product: prod,
    };
  },

  updateChefSpecial(updates: Partial<ChefSpecialConfig>): ChefSpecialConfig {
    const data = initDB();
    const current = data.chefSpecial || DEFAULT_CHEF_SPECIAL;
    const incomingImages = updates.customImages && updates.customImages.length > 0 
      ? updates.customImages 
      : (updates.customImage ? [updates.customImage] : (current.customImages && current.customImages.length > 0 ? current.customImages : [current.customImage || ""]));
    
    data.chefSpecial = {
      ...current,
      ...updates,
      customImages: incomingImages,
      customImage: incomingImages[0] || updates.customImage || current.customImage,
      customPrice: updates.customPrice !== undefined ? Number(updates.customPrice) : current.customPrice,
    };
    saveDB(data);
    const allProducts = this.getProducts();
    const prod = allProducts.find((p) => p.id.toString() === data.chefSpecial!.productId?.toString()) || allProducts[0];
    return {
      ...data.chefSpecial,
      product: prod,
    };
  },

  deleteChefSpecial(): boolean {
    const data = initDB();
    data.chefSpecial = {
      ...(data.chefSpecial || DEFAULT_CHEF_SPECIAL),
      isActive: false,
    };
    saveDB(data);
    return true;
  },
};


