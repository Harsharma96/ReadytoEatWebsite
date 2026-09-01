import { Product } from "@/types/product";

export * from "./product";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 
  | "ORDER_RECEIVED"
  | "CHEF_PREPARING"
  | "WOOD_FIRED_BAKING"
  | "COURIER_DISPATCHED"
  | "DELIVERED";

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  aptSuite?: string;
  notes?: string;
  paymentMethod: "upi" | "card" | "netbanking" | "cod" | "apple_pay" | "google_pay" | "cash" | string;
  paymentStatus?: "PAID" | "PENDING_COD" | "PENDING" | "REFUNDED" | "CANCELLED";
  transactionRef?: string;
  utrNumber?: string;
  upiAppUsed?: string;
  qrCodeScanned?: boolean;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note: string }[];
  etaMinutes: number;
  createdAt: string;
  courierLocation?: { lat: number; lng: number; name: string; vehicle: string };
  feedbackSubmitted?: boolean;
  isArchived?: boolean;
}

export interface FeedbackReview {
  id: string;
  orderId?: string;
  customerName: string;
  rating: number; // 1 to 5
  moodEmoji: string;
  deliveryRating: number; // 1 to 5
  tasteRating: number; // 1 to 5
  favoriteDish?: string;
  tags: string[];
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface PromoCode {
  code: string;
  title?: string;
  discountPercent?: number;
  fixedDiscount?: number;
  minSpend: number;
  description: string;
  isActive: boolean;
  isFlashBanner?: boolean;
  freeItem?: string;
  badgeText?: string;
  hoursLeft?: number;
  bgGradient?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  promoIssued: string;
}

export interface AdminStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalSubscribers: number;
  totalInquiries: number;
  totalPromos: number;
  totalReviews?: number;
  averageRating?: number;
}

export interface FeastBoxTier {
  id: string;
  count: number;
  title: string;
  discountPercent: number;
  badge: string;
  gift: string;
  freeGifts: string[];
  isActive?: boolean;
}

export interface StoreSettings {
  gstPercent: number; // e.g. 5, 12, 18, 0
  isGstEnabled: boolean;
  taxName: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  isFreeDeliveryEnabled: boolean;
  restaurantGstin?: string;
  fssaiNumber?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: "PAID" | "PENDING" | "PENDING_COD" | "REFUNDED" | "CANCELLED";
  transactionRef?: string;
  utrNumber?: string;
  upiAppUsed?: string;
  qrCodeScanned?: boolean;
  itemsSummary?: string;
  refundReason?: string;
  refundAmount?: number;
  refundedAt?: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentGatewaySettings {
  isRazorpayEnabled: boolean;
  isStripeEnabled: boolean;
  isUpiEnabled: boolean;
  isUpiQrEnabled: boolean;
  isOnlineGatewayEnabled: boolean;
  isCodEnabled: boolean;
  isCardOnDeliveryEnabled: boolean;
  mode: "test" | "live";
  currency: string;
  businessUpiId: string;
  payeeName: string;
  qrCodeImageUrl?: string;
  upiInstructions: string;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  autoApproveCodThreshold: number;
  autoApproveUpi?: boolean;
  autoVerifyTimeoutSeconds?: number;
  qrTheme?: "royal-gold" | "phonepe-blue" | "emerald-green";
}

export interface PublicPaymentConfig {
  success?: boolean;
  isUpiQrEnabled: boolean;
  isOnlineGatewayEnabled: boolean;
  isCodEnabled: boolean;
  isCardOnDeliveryEnabled: boolean;
  businessUpiId: string;
  payeeName: string;
  qrCodeImageUrl?: string;
  upiInstructions: string;
  mode?: string;
  currency?: string;
  isRazorpayEnabled?: boolean;
  isStripeEnabled?: boolean;
  razorpayKeyId?: string;
  stripePublishableKey?: string;
  autoApproveUpi?: boolean;
  autoVerifyTimeoutSeconds?: number;
  qrTheme?: "royal-gold" | "phonepe-blue" | "emerald-green";
}

export interface TrendingSpotlightItem {
  id: string;
  productId: string;
  customOfferTag: string; // e.g. "🔥 FLAT 20% OFF TODAY" or "👑 FREE NAAN & CHAI"
  offerBadge: string; // e.g. "TODAY'S DEAL"
  discountPercent?: number;
  priority: number;
  isActive: boolean;
  createdAt: string;
  product?: Product;
}

export interface MenuCategoryItem {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  bgGradient?: string;
  borderColor?: string;
  accent?: string;
  priority?: number;
  isActive: boolean;
  createdAt?: string;
}

export interface ChefSpecialConfig {
  id: string;
  productId: string;
  badgeText: string;
  customTitle?: string;
  customDescription?: string;
  heritageTag: string;
  slowCookingTag: string;
  dailyBatchTag: string;
  customPrice?: number;
  customImage?: string;
  customImages?: string[];
  isActive: boolean;
  buttonText?: string;
  product?: Product;
}
