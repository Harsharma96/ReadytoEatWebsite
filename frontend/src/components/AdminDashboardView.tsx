"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Bike, 
  Flame, 
  Plus, 
  Search, 
  RefreshCw, 
  Eye, 
  Tag, 
  Mail, 
  ChefHat,
  Crown,
  ArrowRight,
  Sparkles,
  AlertCircle,
  UploadCloud,
  Image as ImageIcon,
  X,
  Check,
  Trash2,
  Edit3,
  Power,
  Layers,
  ArrowLeft,
  Filter,
  CheckCircle,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  Phone,
  PhoneCall,
  MapPin,
  Zap,
  Star,
  MessageSquare,
  Package,
  Gift,
  Percent,
  CreditCard,
  Receipt,
  Sliders,
  RotateCcw,
  Award,
  Bell,
  Volume2,
  VolumeX,
  Calendar,
  Printer,
  Download,
  Archive,
  CheckCheck,
  FileText,
  LockKeyhole,
  History,
  Menu,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Order, OrderStatus, PromoCode, ContactInquiry, NewsletterSubscriber, FeedbackReview, FeastBoxTier, StoreSettings, PaymentTransaction, TrendingSpotlightItem, MenuCategoryItem, ChefSpecialConfig, PaymentGatewaySettings } from "@/types";
import { PRODUCTS } from "@/data/products";
import { Product, ProductCategory, CustomizationGroup, CustomizationOption } from "@/types/product";
import { downloadOrderReceipt, downloadDailyShiftClosingReport, DailyClosingReportData } from "@/utils/generateReceipt";

const FOOD_PRESET_IMAGES = [
  { label: "🍔 Smash Cheese Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍗 Crispy Fried Chicken Burger", url: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍕 Cheese Burst Margherita", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍟 Peri-Peri French Fries", url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop" },
  { label: "🥢 Street Hakka Noodles", url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop" },
  { label: "🥟 Steamed Crystal Dim Sums", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍚 Awadhi Dum Biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍗 Purani Dilli Butter Chicken", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍲 24-Hr Dal Makhani", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop" },
  { label: "🟡 Royal Gujarati Thali", url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=1000&auto=format&fit=crop" },
  { label: "🥥 Mysore Butter Masala Dosa", url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=1000&auto=format&fit=crop" },
  { label: "☕ Iced Caramel Cold Coffee", url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop" },
  { label: "🍊 Fresh Valencia Orange Juice", url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1000&auto=format&fit=crop" },
  { label: "☕ Royal Kulhad Masala Chai", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop" },
];

const CATEGORY_GRADIENT_PRESETS = [
  { label: "Warm Orange (Signature)", bgGradient: "from-[#FFF0E5] to-[#FFE4D6]", borderColor: "border-[#FF6B35]/40", accent: "#FF6B35" },
  { label: "Berry Pink (Gourmet)", bgGradient: "from-[#FFE8EC] to-[#FFD5DC]", borderColor: "border-[#FF4D6D]/40", accent: "#FF4D6D" },
  { label: "Golden Amber (Shahi)", bgGradient: "from-[#FFF4E5] to-[#FFE6CC]", borderColor: "border-[#FF8A00]/40", accent: "#FF8A00" },
  { label: "Spicy Terracotta (Desi)", bgGradient: "from-[#FFF2EB] to-[#FCD1B8]", borderColor: "border-[#E85620]/40", accent: "#E85620" },
  { label: "Awadhi Earth (Biryani)", bgGradient: "from-[#FFFBF5] to-[#EFE1CE]", borderColor: "border-[#D4A373]/40", accent: "#D4A373" },
  { label: "Surti Yellow (Gujarati)", bgGradient: "from-[#FFF9E6] to-[#FFEAB3]", borderColor: "border-[#FFC94A]/50", accent: "#FFC94A" },
  { label: "Emerald Mint (Fresh)", bgGradient: "from-[#EAF9EF] to-[#D5F5E0]", borderColor: "border-[#3ECF6E]/40", accent: "#3ECF6E" },
  { label: "Tea Garden Green (Beverage)", bgGradient: "from-[#F0FDF4] to-[#DCFCE7]", borderColor: "border-[#22C55E]/40", accent: "#22C55E" },
  { label: "Shahi Dessert Gold", bgGradient: "from-[#FFF8F2] to-[#F5D8BF]", borderColor: "border-[#E0A96D]/40", accent: "#E0A96D" },
  { label: "Royal Lavender (Luxury)", bgGradient: "from-[#F5F3FF] to-[#EDE9FE]", borderColor: "border-[#8B5CF6]/40", accent: "#8B5CF6" },
];

export type AdminTabType = "orders" | "menu" | "categories" | "chefSpecial" | "trending" | "feastBox" | "payments" | "settings" | "promos" | "reviews" | "inquiries" | "subscribers";

const TAB_TITLES: Record<AdminTabType, { title: string; subtitle: string; badge: string }> = {
  orders: {
    title: "Kitchen Tickets & Live Orders Radar",
    subtitle: "Real-time ticket dispatch, live cooking stages, and GPS courier radar",
    badge: "Live Kitchen Feed",
  },
  menu: {
    title: "Culinary Catalog & Dish Inventory",
    subtitle: "Manage menu items, prices, calories, stock toggles, and add-on choice groups",
    badge: "Menu & Inventory",
  },
  categories: {
    title: "Category Studio & Themes",
    subtitle: "Configure food categories, custom color gradients, emoji icons, and priority order",
    badge: "Category Studio",
  },
  chefSpecial: {
    title: "Royal Chef Special Spotlight",
    subtitle: "Craft the Royal monthly hero spotlight, heritage story, and live showcase toggle",
    badge: "Royal Showcase",
  },
  trending: {
    title: "Trending Spotlights & Flash Offers",
    subtitle: "Feature hot-selling dishes, configure instant flash deals, and countdown timers",
    badge: "Spotlights & Offers",
  },
  feastBox: {
    title: "Dawat Feast Box Combo Packs",
    subtitle: "Build curated discount tiers, complimentary chef gifts, and celebration bundles",
    badge: "Feast Bundles",
  },
  payments: {
    title: "Payments Ledger & Sales Analytics",
    subtitle: "Live UPI & COD transactions, gross sales breakdown, and 7-day tax invoice archive",
    badge: "Financial Ledger",
  },
  settings: {
    title: "GST, FSSAI & Store Configuration",
    subtitle: "Configure GST percentages, FSSAI registration number, and free delivery thresholds",
    badge: "Store Config",
  },
  reviews: {
    title: "Patron Ratings & Verified Feedback",
    subtitle: "Monitor customer ratings, sentiment analysis, and verified diner reviews",
    badge: "Customer Ratings",
  },
  promos: {
    title: "Promo Vouchers & Flash Discounts",
    subtitle: "Create coupon codes, percentage discounts, minimum spends, and expiry limits",
    badge: "Voucher Studio",
  },
  inquiries: {
    title: "CRM Inquiries & Customer Messages",
    subtitle: "Manage patron contact submissions, banquet inquiries, and customer care messages",
    badge: "CRM Inquiries",
  },
  subscribers: {
    title: "VIP Newsletter Subscribers Club",
    subtitle: "Export and manage newsletter leads, exclusive club members, and email campaigns",
    badge: "VIP Club",
  },
};

export default function AdminDashboardView(props: { defaultTab?: AdminTabType; standalone?: boolean }) {
  const defaultTab = props?.defaultTab || "orders";
  const standalone = props?.standalone || false;
  const [mounted, setMounted] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<AdminTabType>(defaultTab);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [reviews, setReviews] = useState<FeedbackReview[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<MenuCategoryItem[]>([]);
  const [feastBoxTiers, setFeastBoxTiers] = useState<FeastBoxTier[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [trendingSpotlights, setTrendingSpotlights] = useState<TrendingSpotlightItem[]>([]);
  const [chefSpecial, setChefSpecial] = useState<ChefSpecialConfig>({
    id: "chef-special-default",
    productId: "double-smash-cheese-burger",
    badgeText: "👑 ROYAL CHEF SPECIAL OF THE MONTH",
    customTitle: "Nawabi Awadhi Zafrani Handi Dum Biryani",
    customDescription: "Curated by Master Ustads of Lucknow. Prime cuts of tender lamb marinated for 48 hours in stone-ground Awadhi spices, layered with aged Basmati rice, infused with Kashmiri saffron milk, and sealed in clay handi for 4 hours of slow charcoal dum cooking.",
    heritageTag: "Awadh Royals",
    slowCookingTag: "4-Hr Clay Dum",
    dailyBatchTag: "Only 40 Handis",
    customImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    customImages: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop"
    ],
    isActive: true,
    buttonText: "Reserve Royal Handi",
  });
  const [isSavingChefSpecial, setIsSavingChefSpecial] = useState<boolean>(false);
  const [settings, setSettings] = useState<StoreSettings>({
    gstPercent: 5,
    isGstEnabled: true,
    taxName: "GST (CGST 2.5% + SGST 2.5%)",
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 49,
    isFreeDeliveryEnabled: true,
    restaurantGstin: "07AABCF1234F1Z8",
    fssaiNumber: "10020011005829"
  });
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Payment Gateway & UPI Scanner Studio State
  const [gatewaySettings, setGatewaySettings] = useState<PaymentGatewaySettings>({
    isRazorpayEnabled: true,
    isStripeEnabled: true,
    isUpiEnabled: true,
    isUpiQrEnabled: true,
    isOnlineGatewayEnabled: true,
    isCodEnabled: true,
    isCardOnDeliveryEnabled: true,
    mode: "test",
    currency: "INR",
    businessUpiId: "foodeat.royal@okhdfcbank",
    payeeName: "FoodEat Royal Kitchen & Catering",
    qrCodeImageUrl: "",
    upiInstructions: "Scan this QR code with any UPI App (Google Pay, PhonePe, Paytm, BHIM) and enter your 12-digit UTR No. below.",
    razorpayKeyId: "rzp_test_luxury_foodeat_2026",
    razorpayKeySecret: "secret_luxury_foodeat_2026",
    stripePublishableKey: "pk_test_luxury_foodeat_2026",
    stripeSecretKey: "sk_test_luxury_foodeat_2026",
    autoApproveCodThreshold: 2000,
  });
  const [isSavingGateway, setIsSavingGateway] = useState<boolean>(false);
  const [qrTestAmount, setQrTestAmount] = useState<number>(549);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [orderDateFilter, setOrderDateFilter] = useState<"ALL" | "TODAY" | "YESTERDAY" | "LAST_7_DAYS" | "CUSTOM">("ALL");
  const [customFilterDate, setCustomFilterDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<"ALL" | "COD_PENDING" | "COD_PAID" | "ONLINE_PAID">("ALL");

  // Day Lock & 7-Day Receipt Archive Modals
  const [showDayLockModal, setShowDayLockModal] = useState<boolean>(false);
  const [showReceiptArchiveModal, setShowReceiptArchiveModal] = useState<boolean>(false);
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState<boolean>(false);
  const [drawerSearch, setDrawerSearch] = useState<string>("");
  const [archiveReceipts, setArchiveReceipts] = useState<PaymentTransaction[]>([]);
  const [isFetchingArchive, setIsFetchingArchive] = useState<boolean>(false);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Real-time audio-visual order notification
  const [newOrderToast, setNewOrderToast] = useState<{
    id: string;
    customerName: string;
    total: number;
    items: string;
    paymentMethod: string;
  } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef<boolean>(true);

  const [menuFilterCategory, setMenuFilterCategory] = useState<string>("All Dishes");
  const [menuFilterBudget, setMenuFilterBudget] = useState<string>("all");

  // Category in Menu Catalog Management & Inline Creation States
  const [showCategoryManager, setShowCategoryManager] = useState<boolean>(false);
  const [showInlineAddCategory, setShowInlineAddCategory] = useState<boolean>(false);
  const [showInlineEditAddCategory, setShowInlineEditAddCategory] = useState<boolean>(false);
  const [inlineCategoryName, setInlineCategoryName] = useState<string>("");
  const [inlineCategoryEmoji, setInlineCategoryEmoji] = useState<string>("🍽️");
  const [inlineCategorySubtitle, setInlineCategorySubtitle] = useState<string>("Chef Specialty");

  // Modals for adding / editing
  const [showAddDishModal, setShowAddDishModal] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<Product | null>(null);
  const [customizingDish, setCustomizingDish] = useState<Product | null>(null);
  const [dishCustomizations, setDishCustomizations] = useState<CustomizationGroup[]>([]);
  const [isSavingCustomizations, setIsSavingCustomizations] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryItem | null>(null);
  const [showAddPromoModal, setShowAddPromoModal] = useState<boolean>(false);
  const [showAddFeastBoxModal, setShowAddFeastBoxModal] = useState<boolean>(false);
  const [editingFeastBoxTier, setEditingFeastBoxTier] = useState<FeastBoxTier | null>(null);
  const [showAddTrendingModal, setShowAddTrendingModal] = useState<boolean>(false);
  const [editingTrendingSpotlight, setEditingTrendingSpotlight] = useState<TrendingSpotlightItem | null>(null);
  const [modalDishSearch, setModalDishSearch] = useState<string>("");
  const [modalDishCategory, setModalDishCategory] = useState<string>("all");

  const [newCategory, setNewCategory] = useState({
    name: "",
    emoji: "🍽️",
    subtitle: "Chef Specialty",
    bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
    borderColor: "border-[#FF6B35]/40",
    accent: "#FF6B35",
    priority: 1,
  });

  const [newTrending, setNewTrending] = useState({
    productId: "",
    customOfferTag: "🔥 TODAY'S SPECIAL: FLAT 50% OFF",
    offerBadge: "CHEF PICK",
    priority: 1,
  });
  const [isSubmittingTrending, setIsSubmittingTrending] = useState(false);

  // Handle Escape key to close/hide any active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddDishModal(false);
        setEditingDish(null);
        setShowAddTrendingModal(false);
        setEditingTrendingSpotlight(null);
        setCustomizingDish(null);
        setShowAddCategoryModal(false);
        setEditingCategory(null);
        setShowAddPromoModal(false);
        setShowAddFeastBoxModal(false);
        setEditingFeastBoxTier(null);
        setShowDayLockModal(false);
        setShowReceiptArchiveModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [newPromo, setNewPromo] = useState<{
    code: string;
    title: string;
    discountPercent: number;
    fixedDiscount?: number;
    minSpend: number;
    description: string;
    isFlashBanner: boolean;
    freeItem: string;
    badgeText: string;
    hoursLeft: number;
  }>({
    code: "",
    title: "",
    discountPercent: 25,
    fixedDiscount: undefined,
    minSpend: 499,
    description: "25% OFF on Shahi Royal Feast orders + 2 Free 24K Gold Gulab Jamuns",
    isFlashBanner: true,
    freeItem: "2 Free 24K Gold Gulab Jamuns",
    badgeText: "👑 LIMITED SHAHI RASOI OFFER",
    hoursLeft: 3,
  });

  // Forms
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const chefSpecialFileInputRef = useRef<HTMLInputElement>(null);

  const [newDish, setNewDish] = useState({
    name: "",
    category: "Burgers & Wraps" as ProductCategory,
    price: "",
    calories: "520",
    budgetTier: "under_299",
    isVeg: true,
    spiceLevel: 2,
    prepTimeMinutes: 15,
    shortDescription: "",
    images: "",
    inStock: true,
  });

  const [newFeastBoxTier, setNewFeastBoxTier] = useState({
    title: "",
    count: "4",
    discountPercent: "15",
    badge: "15% OFF",
    gift: "Complimentary Kesar Matka Lassi",
  });

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Web Audio API Synthesizer for pleasant crystal bell chime
  const playNewOrderChime = () => {
    try {
      if (!soundEnabled || typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Tone 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.35);

      // Tone 2: B5 (987.77 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.12);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  };

  const broadcastMenuUpdate = () => {
    try {
      const timestamp = Date.now().toString();
      localStorage.setItem("foodeat_menu_last_updated", timestamp);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
  };

  // Sync active tab with defaultTab prop and URL search params
  useEffect(() => {
    const auth = sessionStorage.getItem("foodeat_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchAdminData(false);
    } else {
      setLoading(false);
    }

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab") as AdminTabType;
      if (tabParam && ["orders", "menu", "categories", "chefSpecial", "trending", "feastBox", "payments", "settings", "promos", "reviews", "inquiries", "subscribers"].includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (defaultTab) {
        setActiveTab(defaultTab);
      }
    }
  }, [defaultTab]);

  const handleTabChange = (tabId: AdminTabType) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const slugMap: Record<string, string> = {
        orders: "orders",
        menu: "menu",
        categories: "categories",
        chefSpecial: "chef-special",
        trending: "trending",
        feastBox: "feast-box",
        payments: "payments",
        settings: "settings",
        reviews: "reviews",
        promos: "promos",
        inquiries: "inquiries",
        subscribers: "subscribers",
      };
      const slug = slugMap[tabId] || tabId;
      window.history.pushState({}, "", `/admin/${slug}`);
    }
  };

  // Background Auto-Polling for New Orders (Every 6 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchAdminData(true);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAuthenticated, soundEnabled]);

  // Lock Background Page Scroll when Any Admin Modal is Open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      showAddDishModal ||
      Boolean(editingDish) ||
      showAddTrendingModal ||
      Boolean(editingTrendingSpotlight) ||
      Boolean(customizingDish) ||
      showAddCategoryModal ||
      Boolean(editingCategory) ||
      showAddPromoModal ||
      showAddFeastBoxModal ||
      Boolean(editingFeastBoxTier) ||
      showDayLockModal ||
      showReceiptArchiveModal
    );

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showAddDishModal,
    editingDish,
    showAddTrendingModal,
    editingTrendingSpotlight,
    customizingDish,
    showAddCategoryModal,
    editingCategory,
    showAddPromoModal,
    showAddFeastBoxModal,
    editingFeastBoxTier,
    showDayLockModal,
    showReceiptArchiveModal,
  ]);



  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Legacy fallback: if PIN entered, check it (dev mode only)
    if (pinCode === "foodeat2026" || pinCode === "admin") {
      sessionStorage.setItem("foodeat_admin_auth", "true");
      setIsAuthenticated(true);
      setPinError(null);
      fetchAdminData(false);
    } else {
      setPinError("Invalid PIN.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("foodeat_admin_auth");
    localStorage.removeItem("foodeat_admin_token");
    localStorage.removeItem("foodeat_admin_user");
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  };


  const fetchAdminData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?t=${Date.now()}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        const incomingOrders: Order[] = data.orders || [];
        
        // Check for fresh incoming order when in background polling
        if (isBackground && !isFirstLoadRef.current && previousOrderIdsRef.current.size > 0) {
          const newOrders = incomingOrders.filter((o) => !previousOrderIdsRef.current.has(o.id));
          if (newOrders.length > 0) {
            const newest = newOrders[0];
            const itemsStr = newest.items?.map((i) => `${i.quantity}x ${i.name}`).join(", ") || "Royal Feast";
            setNewOrderToast({
              id: newest.id,
              customerName: newest.customerName,
              total: newest.total,
              items: itemsStr,
              paymentMethod: newest.paymentMethod,
            });
            playNewOrderChime();
          }
        }

        // Update known IDs ref
        previousOrderIdsRef.current = new Set(incomingOrders.map((o) => o.id));
        isFirstLoadRef.current = false;

        setOrders(incomingOrders);
        setInquiries(data.inquiries || []);
        setSubscribers(data.subscribers || []);
        setPromos(data.promos || []);
        setReviews(data.reviews || []);
        if (Array.isArray(data.feastBoxTiers) && data.feastBoxTiers.length > 0) {
          setFeastBoxTiers(data.feastBoxTiers);
        }
      }

      const prodRes = await fetch(`/api/products?t=${Date.now()}`);
      const prodData = await prodRes.json();
      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }

      const bundleRes = await fetch(`/api/bundles?t=${Date.now()}`);
      const bundleData = await bundleRes.json();
      if (bundleData.success && Array.isArray(bundleData.tiers)) {
        setFeastBoxTiers(bundleData.tiers);
      }

      const settingsRes = await fetch(`/api/settings?t=${Date.now()}`);
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
      }

      const paymentsRes = await fetch(`/api/admin/payments?t=${Date.now()}`);
      const paymentsData = await paymentsRes.json();
      if (paymentsData.success && Array.isArray(paymentsData.transactions)) {
        setTransactions(paymentsData.transactions);
      }

      const gatewayRes = await fetch(`/api/admin/payments/gateways?t=${Date.now()}`);
      const gatewayData = await gatewayRes.json();
      if (gatewayData.success && gatewayData.settings) {
        setGatewaySettings(gatewayData.settings);
      }

      const trendRes = await fetch(`/api/trending?admin=true&t=${Date.now()}`);
      const trendData = await trendRes.json();
      if (trendData.success && Array.isArray(trendData.spotlights)) {
        setTrendingSpotlights(trendData.spotlights);
      }

      const catRes = await fetch(`/api/categories?admin=true&t=${Date.now()}`);
      const catData = await catRes.json();
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }

      const specialRes = await fetch(`/api/chef-special?t=${Date.now()}`);
      const specialData = await specialRes.json();
      if (specialData.success && specialData.chefSpecial) {
        setChefSpecial(specialData.chefSpecial);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // ==================== COD & UPI VERIFICATION & GATEWAY ACTIONS ====================
  const handleApproveCodPayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_COD_PAYMENT" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "PAID" } : o))
        );
        setTransactions((prev) =>
          prev.map((t) => (t.orderId === orderId ? { ...t, paymentStatus: "PAID" } : t))
        );
        showNotification(`💵 Cash collected & payment approved for Order #${orderId}!`);
        fetchAdminData(true);
      } else {
        showNotification(data.message || "Failed to approve payment");
      }
    } catch (err) {
      console.error("Failed to approve COD payment:", err);
      showNotification("Error approving cash payment");
    }
  };

  const handleVerifyUpiPayment = async (orderId: string, utr?: string) => {
    try {
      const res = await fetch(`/api/admin/payments/${orderId}/verify-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utrNumber: utr || "" }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "PAID" } : o))
        );
        setTransactions((prev) =>
          prev.map((t) => (t.orderId === orderId ? { ...t, paymentStatus: "PAID" } : t))
        );
        showNotification(`⚡ Scanned UPI payment verified & marked PAID for Order #${orderId}! 📱`);
        fetchAdminData(true);
      } else {
        showNotification(data.message || "Failed to verify UPI payment");
      }
    } catch (err) {
      console.error("Failed to verify UPI payment:", err);
      showNotification("Error verifying UPI payment");
    }
  };

  const handleSaveGatewaySettings = async (custom?: PaymentGatewaySettings) => {
    setIsSavingGateway(true);
    try {
      const payload = custom || gatewaySettings;
      const res = await fetch("/api/admin/payments/gateways", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setGatewaySettings(data.settings);
        showNotification("⚡ Payment Gateway & UPI QR Scanner settings saved! 📱");
      } else {
        showNotification(data.message || "Failed to update gateway settings");
      }
    } catch (e) {
      console.error(e);
      showNotification("Error saving payment gateway settings");
    } finally {
      setIsSavingGateway(false);
    }
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setGatewaySettings((prev) => ({ ...prev, qrCodeImageUrl: result }));
      showNotification("📸 Custom QR Scanner image selected! Tap 'Save' to apply.");
    };
    reader.readAsDataURL(file);
  };

  const handleOpenReceiptArchive = async () => {
    setShowReceiptArchiveModal(true);
    setIsFetchingArchive(true);
    try {
      const res = await fetch(`/api/admin/payments?archive=true&days=7&t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        setArchiveReceipts(data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch receipt archive:", err);
    } finally {
      setIsFetchingArchive(false);
    }
  };

  // ==================== CHEF SPECIAL SPOTLIGHT HANDLERS ====================
  const handleSaveChefSpecial = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingChefSpecial(true);
    try {
      const res = await fetch("/api/chef-special", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chefSpecial),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("👑 Royal Chef Special Spotlight saved & published to website!");
        localStorage.setItem("foodeat_chef_special_updated", Date.now().toString());
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        window.dispatchEvent(new Event("storage"));
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to save chef special");
      }
    } catch (err) {
      console.error("Error saving chef special:", err);
      showNotification("Error saving chef special");
    } finally {
      setIsSavingChefSpecial(false);
    }
  };

  const handleToggleChefSpecial = async (active: boolean) => {
    setIsSavingChefSpecial(true);
    try {
      const res = await fetch("/api/chef-special", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...chefSpecial, isActive: active }),
      });
      const data = await res.json();
      if (data.success) {
        setChefSpecial((prev) => ({ ...prev, isActive: active }));
        showNotification(active ? "👑 Chef Special is now LIVE on website!" : "Chef Special spotlight removed / hidden from website.");
        localStorage.setItem("foodeat_chef_special_updated", Date.now().toString());
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        window.dispatchEvent(new Event("storage"));
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error toggling chef special:", err);
    } finally {
      setIsSavingChefSpecial(false);
    }
  };

  // ==================== CATEGORY ACTIONS (CREATE / UPDATE / DELETE / TOGGLE) ====================
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      showNotification("Category name is required");
      return;
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCategory,
          priority: categories.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Category "${data.category.name}" added to Menu!`);
        setShowAddCategoryModal(false);
        setNewCategory({
          name: "",
          emoji: "🍽️",
          subtitle: "Chef Specialty",
          bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
          borderColor: "border-[#FF6B35]/40",
          accent: "#FF6B35",
          priority: 1,
        });
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleQuickAddCategory = async (customName?: string, customEmoji?: string, customSubtitle?: string) => {
    const catName = customName || inlineCategoryName;
    const catEmoji = customEmoji || inlineCategoryEmoji || "🍽️";
    const catSubtitle = customSubtitle || inlineCategorySubtitle || "Chef Specialty";

    if (!catName.trim()) {
      showNotification("Please enter a category name");
      return null;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: catName.trim(),
          emoji: catEmoji,
          subtitle: catSubtitle,
          bgGradient: "from-[#FFF0E5] to-[#FFE4D6]",
          borderColor: "border-[#FF6B35]/40",
          accent: "#FF6B35",
          priority: categories.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.category) {
        showNotification(`🎉 Category "${data.category.name}" created!`);
        setCategories((prev) => {
          const exists = prev.some((c) => c.name.toLowerCase() === data.category.name.toLowerCase());
          return exists ? prev : [...prev, data.category];
        });
        setInlineCategoryName("");
        setInlineCategoryEmoji("🍽️");
        setInlineCategorySubtitle("Chef Specialty");
        setShowInlineAddCategory(false);
        setShowInlineEditAddCategory(false);
        fetchAdminData();
        return data.category.name;
      } else {
        showNotification(data.message || "Failed to create category");
        return null;
      }
    } catch (err) {
      console.error("Error creating category:", err);
      showNotification("Error creating category");
      return null;
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Category "${data.category.name}" updated!`);
        setEditingCategory(null);
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Category "${name}" deleted.`);
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleToggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Category ${!currentStatus ? "Activated" : "Hidden"}`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error toggling category status:", err);
    }
  };

  // Trending Spotlight Handlers
  const handleAddTrendingSpotlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrending.productId) {
      showNotification("Please select a dish from the catalog");
      return;
    }
    setIsSubmittingTrending(true);
    try {
      const res = await fetch("/api/trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrending),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        setShowAddTrendingModal(false);
        setNewTrending({
          productId: "",
          customOfferTag: "🔥 TODAY'S SPECIAL: FLAT 50% OFF",
          offerBadge: "CHEF PICK",
          priority: trendingSpotlights.length + 1,
        });
        showNotification("👑 Dish featured in Trending Spotlights with custom offer!");
      } else {
        showNotification(data.message || "Failed to add trending spotlight");
      }
    } catch (err) {
      console.error("Error adding trending spotlight:", err);
      showNotification("Error saving spotlight");
    } finally {
      setIsSubmittingTrending(false);
    }
  };

  const handleToggleTrendingStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/trending", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTrendingSpotlights((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s))
        );
        showNotification(`Spotlight status set to ${!currentStatus ? "LIVE" : "PAUSED"}`);
      }
    } catch (err) {
      console.error("Error toggling trending status:", err);
    }
  };

  const handleDeleteTrendingSpotlight = async (id: string, dishName?: string) => {
    if (!confirm(`Remove "${dishName || "this dish"}" from Trending Spotlights?`)) return;
    try {
      const res = await fetch(`/api/trending?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTrendingSpotlights((prev) => prev.filter((s) => s.id !== id));
        showNotification(`Removed from Trending Spotlights.`);
      }
    } catch (err) {
      console.error("Error deleting trending spotlight:", err);
    }
  };

  const handleUpdateTrendingSpotlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrendingSpotlight) return;
    setIsSubmittingTrending(true);
    try {
      const res = await fetch("/api/trending", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTrendingSpotlight),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        setEditingTrendingSpotlight(null);
        showNotification("👑 Trending Offer & Spotlight updated successfully!");
      } else {
        showNotification(data.message || "Failed to update spotlight");
      }
    } catch (err) {
      console.error("Error updating trending spotlight:", err);
      showNotification("Error saving changes");
    } finally {
      setIsSubmittingTrending(false);
    }
  };

  // Save Settings & GST Configuration
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showNotification("👑 GST & Store Pricing Controls updated successfully!");
      } else {
        showNotification(data.message || "Failed to update settings");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      showNotification("Error updating settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ==================== PROMO & FLASH OFFER BANNER HANDLERS ====================
  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) {
      showNotification("Please enter a Promo Voucher Code (e.g. FESTIVE25)");
      return;
    }
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`🎉 Promo Voucher "${newPromo.code.toUpperCase()}" created & synced to website!`);
        setShowAddPromoModal(false);
        setNewPromo({
          code: "",
          title: "",
          discountPercent: 25,
          fixedDiscount: undefined,
          minSpend: 499,
          description: "25% OFF on Shahi Royal Feast orders + 2 Free 24K Gold Gulab Jamuns",
          isFlashBanner: true,
          freeItem: "2 Free 24K Gold Gulab Jamuns",
          badgeText: "👑 LIMITED SHAHI RASOI OFFER",
          hoursLeft: 3,
        });
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        localStorage.setItem("foodeat_promos_updated", Date.now().toString());
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to create promo");
      }
    } catch (err) {
      console.error("Error creating promo:", err);
      showNotification("Error creating promo");
    }
  };

  const handleUpdatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;
    try {
      const res = await fetch(`/api/admin/promos/${editingPromo.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPromo),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Promo code "${editingPromo.code}" updated!`);
        setEditingPromo(null);
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        localStorage.setItem("foodeat_promos_updated", Date.now().toString());
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to update promo");
      }
    } catch (err) {
      console.error("Error updating promo:", err);
      showNotification("Error updating promo");
    }
  };

  const handleTogglePromo = async (code: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/promos/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Promo ${code} is now ${!currentStatus ? "LIVE ACTIVE" : "PAUSED"}`);
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        localStorage.setItem("foodeat_promos_updated", Date.now().toString());
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error toggling promo status:", err);
    }
  };

  const handleToggleFlashBanner = async (code: string, currentFlash: boolean) => {
    try {
      const res = await fetch(`/api/admin/promos/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFlashBanner: !currentFlash, isActive: true }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Promo ${code} set as Live Flash Offer Banner on website!`);
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        localStorage.setItem("foodeat_promos_updated", Date.now().toString());
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error setting flash banner promo:", err);
    }
  };

  const handleDeletePromo = async (code: string) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/promos/${code}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification(`Promo code "${code}" deleted.`);
        localStorage.setItem("foodeat_menu_last_updated", Date.now().toString());
        localStorage.setItem("foodeat_promos_updated", Date.now().toString());
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error deleting promo:", err);
    }
  };

  // Delete Transaction / Order
  const handleDeleteTransaction = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete transaction record for Order #${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/payments?orderId=${encodeURIComponent(orderId)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTransactions((prev) => prev.filter((t) => t.orderId !== orderId));
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showNotification(`Transaction for Order #${orderId} deleted.`);
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  // Download Invoice for a transaction
  const handleDownloadTransactionInvoice = (tx: PaymentTransaction) => {
    const matchedOrder = orders.find((o) => o.id === tx.orderId);
    downloadOrderReceipt({
      orderId: tx.orderId,
      customerName: tx.customerName,
      phone: tx.phone,
      address: matchedOrder?.address || "Connaught Place, New Delhi",
      items: matchedOrder?.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })) || [
        { name: "Royal Shahi Feast", quantity: 1, price: tx.subtotal }
      ],
      subtotal: tx.subtotal,
      discount: tx.discountAmount,
      shipping: tx.deliveryFee || 0,
      tax: tx.taxAmount || 0,
      gstPercent: settings.gstPercent || 5,
      total: tx.totalAmount,
      paymentMethod: tx.paymentMethod,
      date: new Date(tx.createdAt).toLocaleString("en-IN"),
    });
  };

  // Image Upload File Handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish((prev) => ({ ...prev, images: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingDish) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingDish({ ...editingDish, images: [reader.result as string] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChefSpecialImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImages = (chefSpecial.customImages && chefSpecial.customImages.length > 0)
      ? [...chefSpecial.customImages]
      : (chefSpecial.customImage ? [chefSpecial.customImage] : []);

    const newImages: string[] = [];
    const totalFiles = Math.min(files.length, 4);
    let processed = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      if (file.size > 8 * 1024 * 1024) {
        showNotification(`File ${file.name} is too large (>8MB).`);
        continue;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          newImages.push(reader.result as string);
        }
        processed++;
        if (processed === totalFiles) {
          const combined = [...currentImages, ...newImages].slice(0, 4);
          setChefSpecial((prev) => ({
            ...prev,
            customImages: combined,
            customImage: combined[0] || "",
          }));
          showNotification(`📸 ${newImages.length} photo(s) added to Spotlight!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveChefSpecialImage = (idxToRemove: number) => {
    const current = (chefSpecial.customImages && chefSpecial.customImages.length > 0)
      ? [...chefSpecial.customImages]
      : (chefSpecial.customImage ? [chefSpecial.customImage] : []);
    
    const next = current.filter((_, idx) => idx !== idxToRemove);
    setChefSpecial((prev) => ({
      ...prev,
      customImages: next,
      customImage: next[0] || "",
    }));
    showNotification("Photo removed from Spotlight.");
  };

  const handleSetPrimaryChefSpecialImage = (idxToPrimary: number) => {
    const current = (chefSpecial.customImages && chefSpecial.customImages.length > 0)
      ? [...chefSpecial.customImages]
      : (chefSpecial.customImage ? [chefSpecial.customImage] : []);
    
    if (idxToPrimary === 0 || !current[idxToPrimary]) return;
    const target = current[idxToPrimary];
    const rest = current.filter((_, idx) => idx !== idxToPrimary);
    const next = [target, ...rest];
    setChefSpecial((prev) => ({
      ...prev,
      customImages: next,
      customImage: next[0] || "",
    }));
    showNotification("Set as primary cover photo!");
  };

  const handleAddPresetChefSpecialImage = (url: string) => {
    const current = (chefSpecial.customImages && chefSpecial.customImages.length > 0)
      ? [...chefSpecial.customImages]
      : (chefSpecial.customImage ? [chefSpecial.customImage] : []);
    
    if (current.includes(url)) {
      showNotification("This photo is already in the gallery.");
      return;
    }
    const next = [...current, url].slice(0, 4);
    setChefSpecial((prev) => ({
      ...prev,
      customImages: next,
      customImage: next[0] || url,
    }));
    showNotification("Preset photo added to Spotlight!");
  };

  // ==================== ORDER ACTIONS (UPDATE / DELETE) ====================
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      const isCod = order?.paymentMethod?.toLowerCase().includes("cod") || order?.paymentMethod?.toLowerCase().includes("cash");
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: `Admin updated status to ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  ...(newStatus === "DELIVERED" && isCod ? { paymentStatus: "PAID" } : {}),
                }
              : o
          )
        );

        // If marked as DELIVERED (Done), automatically record in Sales Ledger (Transactions)
        if (newStatus === "DELIVERED" && order) {
          const txRecord: PaymentTransaction = {
            id: `tx-${order.id}`,
            orderId: order.id,
            customerName: order.customerName,
            phone: order.phone,
            paymentMethod: isCod ? "Cash on Delivery (Paid)" : (order.paymentMethod || "UPI Express"),
            paymentStatus: "PAID",
            subtotal: order.subtotal,
            discountAmount: order.discount || 0,
            taxAmount: order.tax || 0,
            deliveryFee: order.deliveryFee || 0,
            totalAmount: order.total,
            createdAt: new Date().toISOString(),
          };
          setTransactions((prev) => {
            const withoutThis = prev.filter((t) => t.orderId !== order.id);
            return [txRecord, ...withoutThis];
          });
          showNotification(`🎉 Order #${order.id.slice(-4)} marked Done & moved to Sales Ledger / Transactions!`);
        } else {
          showNotification(`Order #${orderId.slice(-4)} advanced to "${newStatus.replace(/_/g, " ")}"`);
        }

        fetchAdminData(true);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showNotification(`Order #${orderId} deleted.`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  // Quick Seed Sample Live Order
  const handleQuickSeedOrder = async () => {
    try {
      const sampleOrder = {
        customerName: "Raja Vikramaditya Singhania",
        email: "vikram.singhania@heritage.in",
        phone: "+91 98765 43210",
        address: "Villa 12, Royale Palms, Connaught Place, New Delhi 110001",
        paymentMethod: "UPI (Google Pay Express)",
        items: [
          {
            productId: "double-smash-cheese-burger",
            name: "Double Melt Gourmet Smash Cheese Burger",
            price: 299,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
          },
          {
            productId: "peri-peri-fries",
            name: "Golden Crispy Peri-Peri French Fries with Cheese Dip",
            price: 149,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop",
          },
          {
            productId: "iced-caramel-cold-coffee",
            name: "Iced Caramel Macchiato Cold Coffee Shake",
            price: 179,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop",
          },
        ],
        subtotal: 1254,
        discount: 250,
        promoCode: "DESI20",
        deliveryFee: 0,
        tax: 50,
        total: 1054,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleOrder),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Sample Feast Order #${data.orderId} created!`);
        fetchAdminData();
        setActiveTab("orders");
      }
    } catch (err) {
      console.error("Failed to seed sample order:", err);
    }
  };

  // ==================== DISH ACTIONS (CREATE / UPDATE / DELETE) ====================
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceNum = Number(newDish.price);
      let calculatedBudget = "premium";
      if (priceNum <= 199) calculatedBudget = "under_199";
      else if (priceNum <= 299) calculatedBudget = "under_299";
      else if (priceNum <= 399) calculatedBudget = "under_399";

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDish.name,
          category: newDish.category,
          price: priceNum,
          calories: Number(newDish.calories),
          budgetTier: calculatedBudget,
          isVeg: newDish.isVeg,
          spiceLevel: newDish.spiceLevel,
          prepTimeMinutes: Number(newDish.prepTimeMinutes),
          shortDescription: newDish.shortDescription,
          images: newDish.images ? [newDish.images] : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddDishModal(false);
        setNewDish({ 
          name: "", 
          category: "Burgers & Wraps", 
          price: "", 
          calories: "520", 
          budgetTier: "under_299",
          isVeg: true,
          spiceLevel: 2,
          prepTimeMinutes: 15,
          shortDescription: "", 
          images: "",
          inStock: true,
        });
        showNotification(`Dish "${data.product.name}" created and added to Menu!`);
        if (data.product) {
          setProducts((prev) => [data.product, ...prev]);
        }
        setActiveTab("menu");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to create dish:", err);
    }
  };

  const handleUpdateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    try {
      const res = await fetch(`/api/admin/products/${editingDish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDish),
      });
      const data = await res.json();
      if (data.success) {
        setEditingDish(null);
        showNotification(`Dish "${data.product.name}" updated!`);
        setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to update dish:", err);
    }
  };

  const handleDeleteDish = async (dishId: string, dishName: string) => {
    if (!confirm(`Are you sure you want to delete dish "${dishName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${dishId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== dishId));
        showNotification(`Dish "${dishName}" deleted.`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to delete dish:", err);
    }
  };

  // ==================== DISH STOCK / AVAILABILITY TOGGLE ====================
  const handleToggleDishStock = async (dishId: string, newInStock: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${dishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: newInStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === dishId ? { ...p, inStock: newInStock } : p))
        );
        showNotification(
          `Dish "${data.product?.name || dishId}" marked as ${
            newInStock ? "🟢 In Stock (Available)" : "🔴 Out of Stock (Sold Out)"
          }!`
        );
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to toggle dish stock:", err);
    }
  };

  // ==================== DISH CHOICES & ADD-ONS CUSTOMIZATION MANAGER ====================
  const handleOpenCustomizationManager = (dish: Product) => {
    setCustomizingDish(dish);
    if (dish.customizations && dish.customizations.length > 0) {
      setDishCustomizations(JSON.parse(JSON.stringify(dish.customizations)));
    } else {
      // Smart template based on category
      const isDessert = 
        dish.category?.toLowerCase().includes("dessert") || 
        dish.category?.toLowerCase().includes("halwua") || 
        dish.category?.toLowerCase().includes("mithai") ||
        dish.name?.toLowerCase().includes("halwa") ||
        dish.name?.toLowerCase().includes("haluwa");

      const isBiryani = 
        dish.category?.toLowerCase().includes("biryani") || 
        dish.category?.toLowerCase().includes("north") ||
        dish.category?.toLowerCase().includes("thali") ||
        dish.category?.toLowerCase().includes("gujarati");

      const isPizza = dish.category?.toLowerCase().includes("pizza");
      const isBeverage = dish.category?.toLowerCase().includes("chai") || dish.category?.toLowerCase().includes("coffee") || dish.category?.toLowerCase().includes("juice");

      if (isDessert) {
        setDishCustomizations([
          {
            id: `serving-${Date.now()}`,
            title: "♨️ Serving Temperature & Style",
            type: "single",
            required: true,
            options: [
              { id: "hot-1", name: "Piping Hot in Clay Matka", price: 0, isDefault: true },
              { id: "warm-2", name: "Classic Warm / Room Temp", price: 0 },
              { id: "chilled-3", name: "Chilled Saffron Style", price: 0 },
            ]
          },
          {
            id: `addons-${Date.now()}`,
            title: "🌰 Royal Dry Fruit & Saffron Upgrades",
            type: "multiple",
            options: [
              { id: "almonds-1", name: "Roasted Mamra Badam & Pista (+25g)", price: 35 },
              { id: "kesar-2", name: "Kashmiri Kesar Saffron Infusion", price: 40 },
              { id: "vark-3", name: "100% Pure 24K Chandi Vark Foil", price: 25 },
            ]
          },
          {
            id: `combo-${Date.now()}`,
            title: "🍨 Make It A Royal Dawat Combo",
            type: "single",
            options: [
              { id: "solo-1", name: "Solo Dish", price: 0, isDefault: true },
              { id: "rabdi-2", name: "Add Shahi Malai Rabdi Cup", price: 69 },
              { id: "kulfi-3", name: "Add Kesar Pista Matka Kulfi", price: 79 },
            ]
          }
        ]);
      } else if (isPizza) {
        setDishCustomizations([
          {
            id: `crust-${Date.now()}`,
            title: "🍕 Crust Selection",
            type: "single",
            required: true,
            options: [
              { id: "cb-1", name: "Cheese Burst Liquid Core", price: 0, isDefault: true },
              { id: "thin-2", name: "Ultra Thin Sourdough Crust", price: 0 },
              { id: "garlic-3", name: "Stuffed Garlic Herb Crust", price: 49 },
            ]
          },
          {
            id: `toppings-${Date.now()}`,
            title: "🧄 Extra Gourmet Dips & Add-ons",
            type: "multiple",
            options: [
              { id: "mozz-1", name: "Extra Stringy Mozzarella", price: 49 },
              { id: "jal-2", name: "Cheesy Jalapeno Dip Cup", price: 39 },
              { id: "drink-3", name: "Add Chilled Cold Drink (350ml)", price: 49 },
            ]
          }
        ]);
      } else if (isBiryani) {
        setDishCustomizations([
          {
            id: `portion-${Date.now()}`,
            title: "🍚 Portion Size & Packing",
            type: "single",
            required: true,
            options: [
              { id: "single-1", name: "Single Royal Portion (500g)", price: 0, isDefault: true },
              { id: "grand-2", name: "Maharaja Family Handi (1kg)", price: 249 },
            ]
          },
          {
            id: `spice-${Date.now()}`,
            title: "🌶️ Spice Tolerance Level",
            type: "single",
            options: [
              { id: "mild-1", name: "Mild Shahi Awadhi Flavor", price: 0 },
              { id: "med-2", name: "Classic Medium Dum Spice", price: 0, isDefault: true },
              { id: "spicy-3", name: "Extra Spicy Hyderabadi Mirch", price: 0 },
            ]
          },
          {
            id: `acc-${Date.now()}`,
            title: "🍲 Dips & Accompaniments",
            type: "multiple",
            options: [
              { id: "raita-1", name: "Extra Burani Garlic Raita", price: 35 },
              { id: "salan-2", name: "Extra Mirchi Ka Salan Gravy", price: 30 },
              { id: "egg-3", name: "Add Desi Ghee Golden Fried Eggs (2 pcs)", price: 40 },
            ]
          }
        ]);
      } else if (isBeverage) {
        setDishCustomizations([
          {
            id: `sugar-${Date.now()}`,
            title: "🍬 Sweetness Preference",
            type: "single",
            options: [
              { id: "norm-1", name: "Classic Sweetness (100%)", price: 0, isDefault: true },
              { id: "less-2", name: "Mild Sweetness (50%)", price: 0 },
              { id: "zero-3", name: "Zero Sugar / Sugar-Free (0%)", price: 0 },
            ]
          },
          {
            id: `temp-${Date.now()}`,
            title: "🧊 Serving Temperature",
            type: "single",
            options: [
              { id: "cold-1", name: "Ice Cold with Crushed Ice", price: 0, isDefault: true },
              { id: "hot-2", name: "Steaming Hot in Thermal Cup", price: 0 },
            ]
          },
          {
            id: `boost-${Date.now()}`,
            title: "🥛 Milk & Boosters",
            type: "multiple",
            options: [
              { id: "oat-1", name: "Switch to Organic Oat Milk", price: 40 },
              { id: "kesar-2", name: "Add Extra Espresso Shot / Kesar", price: 35 },
            ]
          }
        ]);
      } else {
        setDishCustomizations([
          {
            id: `bun-${Date.now()}`,
            title: "🍞 Choose Artisan Bun / Base",
            type: "single",
            options: [
              { id: "brioche-1", name: "Butter Toasted Brioche Bun", price: 0, isDefault: true },
              { id: "wheat-2", name: "Whole Wheat Multigrain Bun", price: 20 },
              { id: "gluten-3", name: "Gluten-Free Charcoal Bun", price: 30 },
            ]
          },
          {
            id: `addons-${Date.now()}`,
            title: "🧀 Cheese, Toppings & Upgrades",
            type: "multiple",
            options: [
              { id: "cheese-1", name: "Extra Melted Cheddar Slice", price: 30 },
              { id: "patty-2", name: "Add Extra Smashed Patty", price: 80 },
              { id: "onions-3", name: "Caramelized Butter Onions", price: 20 },
            ]
          },
          {
            id: `combo-${Date.now()}`,
            title: "🍟 Make It A Meal Combo",
            type: "single",
            options: [
              { id: "solo-1", name: "Solo Dish", price: 0, isDefault: true },
              { id: "fries-2", name: "Add Peri-Peri Fries + Cold Drink", price: 99 },
              { id: "nachos-3", name: "Add Loaded Nachos + Thick Shake", price: 159 },
            ]
          }
        ]);
      }
    }
  };

  const handleAddCustomizationGroup = () => {
    const newGroup: CustomizationGroup = {
      id: `grp-${Date.now()}`,
      title: "✨ New Customization Group",
      type: "single",
      options: [
        { id: `opt-${Date.now()}-1`, name: "Standard Choice", price: 0, isDefault: true },
        { id: `opt-${Date.now()}-2`, name: "Premium Upgrade (+₹30)", price: 30 },
      ],
    };
    setDishCustomizations((prev) => [...prev, newGroup]);
  };

  const handleUpdateGroupTitle = (groupId: string, title: string) => {
    setDishCustomizations((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, title } : g))
    );
  };

  const handleUpdateGroupType = (groupId: string, type: "single" | "multiple") => {
    setDishCustomizations((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, type } : g))
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setDishCustomizations((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleAddOptionToGroup = (groupId: string) => {
    const newOpt: CustomizationOption = {
      id: `opt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: "New Add-on Option",
      price: 20,
    };
    setDishCustomizations((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, newOpt] } : g
      )
    );
  };

  const handleUpdateOption = (groupId: string, optionId: string, updates: Partial<CustomizationOption>) => {
    setDishCustomizations((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          options: g.options.map((opt) => {
            if (opt.id !== optionId) {
              if (updates.isDefault && g.type === "single") {
                return { ...opt, isDefault: false };
              }
              return opt;
            }
            return { ...opt, ...updates };
          }),
        };
      })
    );
  };

  const handleDeleteOption = (groupId: string, optionId: string) => {
    setDishCustomizations((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, options: g.options.filter((opt) => opt.id !== optionId) }
          : g
      )
    );
  };

  const handleApplyPresetTemplate = (presetType: "dessert" | "burger" | "pizza" | "biryani" | "beverage") => {
    if (presetType === "dessert") {
      setDishCustomizations([
        {
          id: `serving-${Date.now()}`,
          title: "♨️ Serving Temperature & Style",
          type: "single",
          required: true,
          options: [
            { id: "hot-1", name: "Piping Hot in Clay Matka", price: 0, isDefault: true },
            { id: "warm-2", name: "Classic Warm / Room Temp", price: 0 },
            { id: "chilled-3", name: "Chilled Saffron Style", price: 0 },
          ]
        },
        {
          id: `addons-${Date.now()}`,
          title: "🌰 Royal Dry Fruit & Saffron Upgrades",
          type: "multiple",
          options: [
            { id: "almonds-1", name: "Roasted Mamra Badam & Pista (+25g)", price: 35 },
            { id: "kesar-2", name: "Kashmiri Kesar Saffron Infusion", price: 40 },
            { id: "vark-3", name: "100% Pure 24K Chandi Vark Foil", price: 25 },
          ]
        },
        {
          id: `combo-${Date.now()}`,
          title: "🍨 Make It A Royal Dawat Combo",
          type: "single",
          options: [
            { id: "solo-1", name: "Solo Dish", price: 0, isDefault: true },
            { id: "rabdi-2", name: "Add Shahi Malai Rabdi Cup", price: 69 },
            { id: "kulfi-3", name: "Add Kesar Pista Matka Kulfi", price: 79 },
          ]
        }
      ]);
    } else if (presetType === "burger") {
      setDishCustomizations([
        {
          id: `bun-${Date.now()}`,
          title: "🍞 Choose Artisan Bun",
          type: "single",
          options: [
            { id: "brioche-1", name: "Butter Toasted Brioche Bun", price: 0, isDefault: true },
            { id: "wheat-2", name: "Whole Wheat Multigrain Bun", price: 20 },
            { id: "charcoal-3", name: "Gluten-Free Charcoal Bun", price: 30 },
          ]
        },
        {
          id: `addons-${Date.now()}`,
          title: "🧀 Cheese & Patty Upgrades",
          type: "multiple",
          options: [
            { id: "cheese-1", name: "Extra Melted Cheddar Slice", price: 30 },
            { id: "patty-2", name: "Add Extra Smashed Patty", price: 80 },
            { id: "onions-3", name: "Caramelized Butter Onions", price: 20 },
          ]
        },
        {
          id: `combo-${Date.now()}`,
          title: "🍟 Make It A Meal Combo",
          type: "single",
          options: [
            { id: "solo-1", name: "Solo Dish", price: 0, isDefault: true },
            { id: "fries-2", name: "Add Peri-Peri Fries + Cold Drink", price: 99 },
            { id: "nachos-3", name: "Add Loaded Nachos + Thick Shake", price: 159 },
          ]
        }
      ]);
    } else if (presetType === "pizza") {
      setDishCustomizations([
        {
          id: `crust-${Date.now()}`,
          title: "🍕 Crust Selection",
          type: "single",
          options: [
            { id: "cb-1", name: "Cheese Burst Liquid Core", price: 0, isDefault: true },
            { id: "thin-2", name: "Ultra Thin Sourdough Crust", price: 0 },
            { id: "garlic-3", name: "Stuffed Garlic Herb Crust", price: 49 },
          ]
        },
        {
          id: `toppings-${Date.now()}`,
          title: "🧄 Extra Dips & Drinks",
          type: "multiple",
          options: [
            { id: "mozz-1", name: "Extra Stringy Mozzarella", price: 49 },
            { id: "jal-2", name: "Cheesy Jalapeno Dip Cup", price: 39 },
            { id: "drink-3", name: "Add Chilled Cold Drink (350ml)", price: 49 },
          ]
        }
      ]);
    } else if (presetType === "biryani") {
      setDishCustomizations([
        {
          id: `portion-${Date.now()}`,
          title: "🍚 Portion Size & Packing",
          type: "single",
          options: [
            { id: "single-1", name: "Single Royal Portion (500g)", price: 0, isDefault: true },
            { id: "grand-2", name: "Maharaja Family Handi (1kg)", price: 249 },
          ]
        },
        {
          id: `spice-${Date.now()}`,
          title: "🌶️ Spice Tolerance Level",
          type: "single",
          options: [
            { id: "mild-1", name: "Mild Shahi Awadhi Flavor", price: 0 },
            { id: "med-2", name: "Classic Medium Dum Spice", price: 0, isDefault: true },
            { id: "spicy-3", name: "Extra Spicy Hyderabadi Mirch", price: 0 },
          ]
        },
        {
          id: `acc-${Date.now()}`,
          title: "🍲 Dips & Accompaniments",
          type: "multiple",
          options: [
            { id: "raita-1", name: "Extra Burani Garlic Raita", price: 35 },
            { id: "salan-2", name: "Extra Mirchi Ka Salan Gravy", price: 30 },
            { id: "egg-3", name: "Add Desi Ghee Golden Fried Eggs (2 pcs)", price: 40 },
          ]
        }
      ]);
    } else if (presetType === "beverage") {
      setDishCustomizations([
        {
          id: `sugar-${Date.now()}`,
          title: "🍬 Sweetness Preference",
          type: "single",
          options: [
            { id: "norm-1", name: "Classic Sweetness (100%)", price: 0, isDefault: true },
            { id: "less-2", name: "Mild Sweetness (50%)", price: 0 },
            { id: "zero-3", name: "Zero Sugar / Sugar-Free (0%)", price: 0 },
          ]
        },
        {
          id: `temp-${Date.now()}`,
          title: "🧊 Serving Temperature",
          type: "single",
          options: [
            { id: "cold-1", name: "Ice Cold with Crushed Ice", price: 0, isDefault: true },
            { id: "hot-2", name: "Steaming Hot in Thermal Cup", price: 0 },
          ]
        },
        {
          id: `boost-${Date.now()}`,
          title: "🥛 Milk & Boosters",
          type: "multiple",
          options: [
            { id: "oat-1", name: "Switch to Organic Oat Milk", price: 40 },
            { id: "kesar-2", name: "Add Extra Espresso Shot / Kesar", price: 35 },
          ]
        }
      ]);
    }
    showNotification("Template applied! You can customize prices and option names.");
  };

  const handleSaveCustomizations = async () => {
    if (!customizingDish) return;
    setIsSavingCustomizations(true);
    try {
      const res = await fetch(`/api/admin/products/${customizingDish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customizations: dishCustomizations }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`🎉 Choices & Add-ons saved for "${customizingDish.name}"!`);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === customizingDish.id ? { ...p, customizations: dishCustomizations } : p
          )
        );
        setCustomizingDish(null);
        fetchAdminData();
      } else {
        showNotification(data.message || "Failed to update choices.");
      }
    } catch (err) {
      console.error("Failed to save customizations:", err);
      showNotification("Error saving customizations.");
    } finally {
      setIsSavingCustomizations(false);
    }
  };

  const handleClearCustomizations = async () => {
    if (!customizingDish) return;
    if (!confirm(`Clear all custom choices for "${customizingDish.name}"? It will revert to category defaults.`)) return;
    setIsSavingCustomizations(true);
    try {
      const res = await fetch(`/api/admin/products/${customizingDish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customizations: [] }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Choices reset to defaults for "${customizingDish.name}".`);
        setDishCustomizations([]);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === customizingDish.id ? { ...p, customizations: [] } : p
          )
        );
        setCustomizingDish(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to clear customizations:", err);
    } finally {
      setIsSavingCustomizations(false);
    }
  };

  // ==================== FEAST BOX DISCOUNT TIERS (CREATE / UPDATE / DELETE) ====================
  const handleCreateFeastBoxTier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newFeastBoxTier.title || `Royal Feast Box (${newFeastBoxTier.count} Dishes)`,
          count: Number(newFeastBoxTier.count),
          discountPercent: Number(newFeastBoxTier.discountPercent),
          badge: newFeastBoxTier.badge || `${newFeastBoxTier.discountPercent}% OFF`,
          gift: newFeastBoxTier.gift || "Complimentary Kesar Matka Lassi",
          freeGifts: [
            `${newFeastBoxTier.discountPercent}% Instant Dawat Discount`,
            newFeastBoxTier.gift || "Complimentary Surprise Dish",
            "Free Thermal Pod Delivery"
          ]
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddFeastBoxModal(false);
        setNewFeastBoxTier({
          title: "",
          count: "4",
          discountPercent: "15",
          badge: "15% OFF",
          gift: "Complimentary Kesar Matka Lassi",
        });
        showNotification(`Feast Box Pack "${data.tier?.title || "New Tier"}" created!`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to create feast box tier:", err);
    }
  };

  const handleUpdateFeastBoxTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeastBoxTier) return;
    try {
      const res = await fetch(`/api/bundles/${editingFeastBoxTier.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingFeastBoxTier.title,
          count: Number(editingFeastBoxTier.count),
          discountPercent: Number(editingFeastBoxTier.discountPercent),
          badge: editingFeastBoxTier.badge,
          gift: editingFeastBoxTier.gift,
          freeGifts: [
            `${editingFeastBoxTier.discountPercent}% Instant Dawat Discount`,
            editingFeastBoxTier.gift || "Complimentary Surprise Dish",
            "Priority 25-Min Thermal Transit"
          ]
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingFeastBoxTier(null);
        showNotification(`Feast Box Tier updated with ${data.tier?.discountPercent}% discount!`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to update feast box tier:", err);
    }
  };

  const handleDeleteFeastBoxTier = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete Feast Box pack "${title}"?`)) return;
    try {
      const res = await fetch(`/api/bundles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeastBoxTiers((prev) => prev.filter((t) => t.id !== id));
        showNotification(`Feast Box pack "${title}" deleted.`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to delete feast box tier:", err);
    }
  };

  // ==================== REVIEWS & FEEDBACK DELETE ====================
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showNotification(`Review ${id} deleted.`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // ==================== INQUIRIES & SUBSCRIBERS ====================
  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        showNotification("Inquiry message cleared.");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/subscribers/${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSubscribers((prev) => prev.filter((s) => s.email !== email));
        showNotification(`Subscriber ${email} removed.`);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    }
  };

  // Filters & Strict Newest-First Sorting
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Base orders matching search & date context (synchronizes pill badges with filtered lists 100%)
  const baseOrdersForFilter = sortedOrders.filter((o) => {
    const matchesSearch = 
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.address && o.address.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesDate = true;
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    const isUndelivered = o.status !== "DELIVERED";

    if (orderDateFilter === "TODAY") {
      matchesDate = isUndelivered || orderDate.toDateString() === today.toDateString();
    } else if (orderDateFilter === "YESTERDAY") {
      const yest = new Date(Date.now() - 86400000);
      matchesDate = orderDate.toDateString() === yest.toDateString();
    } else if (orderDateFilter === "LAST_7_DAYS") {
      matchesDate = orderDate.getTime() >= Date.now() - 7 * 86400000;
    } else if (orderDateFilter === "CUSTOM") {
      matchesDate = orderDate.toISOString().split("T")[0] === customFilterDate;
    }

    return matchesSearch && matchesDate;
  });

  const filteredOrders = baseOrdersForFilter.filter((o) => {
    // If statusFilter is "ALL", only show active kitchen tickets (not delivered)
    // If statusFilter is "DELIVERED", show delivered/completed orders
    const matchesStatus = 
      statusFilter === "ALL" 
        ? o.status !== "DELIVERED" 
        : o.status === statusFilter;

    // Payment Filter
    let matchesPayment = true;
    const isCod = o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash");
    if (orderPaymentFilter === "COD_PENDING") {
      matchesPayment = isCod && o.paymentStatus !== "PAID" && o.status !== "DELIVERED";
    } else if (orderPaymentFilter === "COD_PAID") {
      matchesPayment = isCod && (o.paymentStatus === "PAID" || o.status === "DELIVERED");
    } else if (orderPaymentFilter === "ONLINE_PAID") {
      matchesPayment = !isCod;
    }

    return matchesStatus && matchesPayment;
  });

  const filteredProducts = products.filter((p) => {
    const matchesCategory = menuFilterCategory === "All Dishes" || p.category === menuFilterCategory;
    
    let matchesBudget = true;
    if (menuFilterBudget === "199") matchesBudget = p.price <= 199;
    else if (menuFilterBudget === "299") matchesBudget = p.price > 199 && p.price <= 299;
    else if (menuFilterBudget === "399") matchesBudget = p.price > 299 && p.price <= 399;
    else if (menuFilterBudget === "premium") matchesBudget = p.price > 399;

    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBudget && matchesSearch;
  });

  // ==================== RENDER: LOGIN GATE ====================
  if (!isAuthenticated) {
    // Redirect to proper admin login page
    if (mounted && typeof window !== "undefined") {
      // Check if JWT token exists and is for admin
      const adminToken = localStorage.getItem("foodeat_admin_token");
      const adminUserStr = localStorage.getItem("foodeat_admin_user");
      if (adminToken && adminUserStr) {
        try {
          const adminUser = JSON.parse(adminUserStr);
          if (adminUser.role === "admin") {
            sessionStorage.setItem("foodeat_admin_auth", "true");
            setIsAuthenticated(true);
            fetchAdminData(false);
            return null;
          }
        } catch {}
      }
      // No valid token — redirect to login page
      window.location.href = "/admin/login";
    }
    // Show minimal loading while redirecting
    return (
      <main className="min-h-screen bg-[#060912] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center shadow-glow">
            <LockKeyhole className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-white font-black text-sm font-heading">Redirecting to Admin Login...</p>
            <div className="mt-3 flex gap-1.5 justify-center">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#FF6B35] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==================== 7-DAY FINANCIAL & LOSS/BENEFIT TELEMETRY ====================
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayOrders = orders.filter(o => o.createdAt && new Date(o.createdAt) >= todayStart);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const sevenDayOrders = orders.filter(o => o.createdAt && new Date(o.createdAt) >= sevenDaysAgo);
  const sevenDayRevenue = sevenDayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Cost estimate ~42%, Gross Benefit/Profit ~58%
  const estimatedCost = Math.round(sevenDayRevenue * 0.42);
  const netProfitBenefit = Math.max(0, sevenDayRevenue - estimatedCost);

  const cancelledLossOrders = orders.filter(o => (o.status as string) === "CANCELLED" || (o.paymentStatus as string) === "FAILED");
  const cancelledLossAmount = cancelledLossOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const onlinePaidTotal = orders.filter(o => !o.paymentMethod?.toLowerCase().includes("cod") && !o.paymentMethod?.toLowerCase().includes("cash")).reduce((sum, o) => sum + (o.total || 0), 0);
  const codTotal = orders.filter(o => o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")).reduce((sum, o) => sum + (o.total || 0), 0);


  // ==================== RENDER: AUTHENTICATED DASHBOARD ====================
  return (
    <main className="min-h-screen bg-[#FFF8F2] flex flex-col font-sans relative z-10">
      
      {/* Toast Notification Banner */}
      {actionNotice && (
        <div className="fixed top-5 right-5 z-50 bg-[#0B1220] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#FF6B35]/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#3ECF6E]" />
          <span className="text-xs font-black">{actionNotice}</span>
        </div>
      )}

      {/* Top Floating Luxury Capsule Header (Shown on mobile only on Master Hub; on desktop always shown) */}
      <header className={`sticky top-2 sm:top-4 z-40 px-2 sm:px-6 max-w-7xl mx-auto w-full ${standalone ? "hidden lg:block" : "block"}`}>
        <div className="bg-white/95 backdrop-blur-2xl rounded-full border border-orange-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-1 sm:gap-3 transition-all">
          
          {/* Left: Brand Identity (Matching Storefront style) */}
          <Link href="/admin" className="flex items-center gap-1.5 sm:gap-2.5 group cursor-pointer shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <ChefHat className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs sm:text-base font-black font-heading tracking-tight text-gray-900">FOOD<span className="text-[#FF6B35]">EAT</span></span>
                <span className="text-[7.5px] sm:text-[9px] px-1 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-300">
                  LIVE
                </span>
              </div>
              <p className="text-[7px] sm:text-[9px] font-black tracking-widest text-[#2E7D32] uppercase mt-0.5">
                ADMIN CONSOLE
              </p>
            </div>
          </Link>

          {/* Right: Capsule Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Circular Sound Chime Button */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                showNotification(`Audio Bell Alert ${next ? "Enabled 🔔" : "Muted 🔕"}`);
                if (next) playNewOrderChime();
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                soundEnabled 
                  ? "bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-500"
              }`}
              title={soundEnabled ? "Audio chime ON" : "Audio chime muted"}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* Circular Refresh Telemetry Button */}
            <button
              onClick={() => fetchAdminData()}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FF6B35]" : ""}`} />
            </button>

            {/* Orange Capsule Button (Orders Pill - Direct Separate Page Link) */}
            <Link
              href="/admin/orders"
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] sm:text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 border border-white/20"
              title="View Kitchen Orders"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-heading font-black">Orders</span>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/25 text-white text-[9px] font-black">
                  {orders.length}
                </span>
              )}
            </Link>

            {/* Circular Hamburger / Close Menu Button */}
            <button
              onClick={() => setShowMobileMoreMenu(!showMobileMoreMenu)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              title="All 12 Modules Menu"
            >
              {showMobileMoreMenu ? <X className="w-4 h-4 text-gray-900" /> : <Menu className="w-4 h-4 text-gray-800" />}
            </button>

            {/* Sign Out Button (Desktop & Tablet) */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-black border border-red-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Sign Out of Admin Console"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* Mobile Header Logout Button */}
            <button
              onClick={handleLogout}
              className="sm:hidden w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Sign Out"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </header>

      {/* Global Mobile Navigation Drawer Portal (Works 100% across all pages & standalone subpages) */}
      {mounted && typeof document !== "undefined" && showMobileMoreMenu && createPortal(
        <div 
          onClick={() => setShowMobileMoreMenu(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/70 backdrop-blur-sm flex items-start justify-center p-3 pt-4 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "88vh" }}
            className="bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-orange-200/90 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-150 my-auto"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-xs">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 font-heading leading-tight">Admin Console</h3>
                  <p className="text-[9px] text-gray-400 font-bold leading-none mt-0.5">12 System Modules</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowMobileMoreMenu(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Input for Mobile */}
            <div className="p-3 pb-1.5 shrink-0 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search modules (e.g. orders, menu)..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs font-bold rounded-xl bg-slate-50 border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Navigation List - Pure clean typography with icons & right arrow */}
            <div className="p-3 pt-1.5 flex-1 min-h-0 overflow-y-auto space-y-1 no-scrollbar bg-white">
              {[
                { id: "orders" as const, href: "/admin/orders", label: "Live Orders", badge: `${orders.length} Active`, icon: ShoppingBag, color: "text-[#FF6B35]" },
                { id: "menu" as const, href: "/admin/menu", label: "Menu Catalog", badge: `${products.length} Dishes`, icon: UtensilsCrossed, color: "text-amber-600" },
                { id: "categories" as const, href: "/admin/categories", label: "Categories", badge: `${categories.length} Cats`, icon: Layers, color: "text-indigo-600" },
                { id: "chefSpecial" as const, href: "/admin/chef-special", label: "Chef Special", badge: chefSpecial.isActive ? "👑 Live" : "Off", icon: Crown, color: "text-emerald-600" },
                { id: "trending" as const, href: "/admin/trending", label: "Trending Deals", badge: `${trendingSpotlights.length} Deals`, icon: Flame, color: "text-red-500" },
                { id: "feastBox" as const, href: "/admin/feast-box", label: "Feast Box", badge: `${feastBoxTiers.length} Packs`, icon: Package, color: "text-orange-500" },
                { id: "payments" as const, href: "/admin/payments", label: "Sales Ledger", badge: `₹${Math.round(sevenDayRevenue/1000)}k 7D`, icon: CreditCard, color: "text-emerald-700" },
                { id: "settings" as const, href: "/admin/settings", label: "Store Config & GST", badge: `${settings.gstPercent}% GST`, icon: SlidersHorizontal, color: "text-blue-600" },
                { id: "reviews" as const, href: "/admin/reviews", label: "Reviews", badge: `${reviews.length} Feedbacks`, icon: Star, color: "text-amber-500" },
                { id: "promos" as const, href: "/admin/promos", label: "Promo Codes & Vouchers", badge: `${promos.length} Codes`, icon: Tag, color: "text-rose-500" },
                { id: "inquiries" as const, href: "/admin/inquiries", label: "Inquiries CRM", badge: `${inquiries.length} Leads`, icon: MessageSquare, color: "text-cyan-600" },
                { id: "subscribers" as const, href: "/admin/subscribers", label: "VIP Club Patrons", badge: `${subscribers.length} Fans`, icon: Users, color: "text-purple-600" },
              ]
                .filter((item) => 
                  !drawerSearch || 
                  item.label.toLowerCase().includes(drawerSearch.toLowerCase()) || 
                  item.id.toLowerCase().includes(drawerSearch.toLowerCase())
                )
                .map((item) => {
                  const isActive = activeTab === item.id;
                  const IconComp = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setShowMobileMoreMenu(false)}
                      className={`px-2.5 py-2 rounded-xl flex items-center justify-between transition-all ${
                        isActive 
                          ? "bg-orange-50 border border-orange-200/90 text-[#FF6B35] font-black shadow-2xs" 
                          : "hover:bg-gray-50 border border-transparent text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-[#FF6B35] text-white" : "bg-gray-100 " + item.color}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className={`font-heading font-black tracking-tight text-[12px] truncate ${isActive ? "text-[#FF6B35]" : "text-gray-900"}`}>{item.label}</span>
                        <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-md truncate ${isActive ? "bg-orange-100 text-[#FF6B35]" : "bg-gray-100 text-gray-500"}`}>
                          {item.badge}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#FF6B35]" : "text-gray-300"}`} />
                    </Link>
                  );
                })}
            </div>

            {/* Quick Actions Footer Strip */}
            <div className="p-3 pt-2 border-t border-gray-100 flex items-center gap-1.5 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowMobileMoreMenu(false);
                  setShowDayLockModal(true);
                }}
                className="flex-1 h-7 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-[10px] font-black flex items-center justify-center gap-1 shadow-2xs active:scale-95 cursor-pointer truncate"
              >
                <LockKeyhole className="w-3 h-3 shrink-0" />
                <span className="truncate">Lock Shift</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMoreMenu(false);
                  handleOpenReceiptArchive();
                }}
                className="flex-1 h-7 px-2 rounded-lg bg-gray-50 hover:bg-orange-50 text-gray-800 text-[10px] font-black flex items-center justify-center gap-1 border border-gray-200 shadow-2xs active:scale-95 cursor-pointer truncate"
              >
                <Archive className="w-3 h-3 text-[#3ECF6E] shrink-0" />
                <span className="truncate">7D Receipts</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMobileMoreMenu(false);
                  handleQuickSeedOrder();
                }}
                className="h-7 px-2 rounded-lg bg-gray-50 hover:bg-orange-50 text-amber-700 text-[10px] font-black flex items-center justify-center gap-1 border border-gray-200 shadow-2xs active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+ Test</span>
              </button>
            </div>

            {/* Mobile Drawer Dedicated Sign Out Button */}
            <div className="p-3 pt-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowMobileMoreMenu(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs flex items-center justify-center gap-2 border border-red-200 transition-all cursor-pointer active:scale-95"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Sign Out & Lock Console</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8 w-full space-y-2.5 sm:space-y-6 flex-1 pb-8">
        
        {!standalone ? (
          <div className="space-y-2.5 sm:space-y-6">
            
            {/* 🌟 7-DAY EXECUTIVE FINANCIAL HEALTH & BENEFIT/LOSS CARD */}
            <div className="bg-gradient-to-br from-[#0B1220] via-[#162032] to-[#0B1220] text-white p-3.5 sm:p-6 rounded-2xl sm:rounded-[32px] border border-white/10 shadow-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />
              
              {/* Header Row */}
              <div className="flex items-start sm:items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-base font-black font-heading tracking-wide uppercase text-white">
                      7-Day Business Health
                    </h3>
                    <p className="text-[8.5px] sm:text-xs text-gray-400">Revenue, Net Benefit & Telemetry</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] sm:text-[9px] font-black border border-emerald-500/30 mb-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> LIVE SYNC
                  </span>
                  <div className="text-sm sm:text-xl font-black text-[#3ECF6E] font-heading leading-tight">
                    ₹{sevenDayRevenue.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* 4 Financial KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 relative z-10">
                {/* Metric 1: Today's Sales */}
                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[11px] font-bold">
                    <span>Today Sales</span>
                    <span className="text-amber-400 font-black">{todayOrders.length} orders</span>
                  </div>
                  <div className="text-sm sm:text-lg font-black text-white mt-1">
                    ₹{todayRevenue.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Metric 2: Net Benefit / Profit (~58%) */}
                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-emerald-300 text-[9px] sm:text-[11px] font-bold">
                    <span>Net Profit</span>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-black">+58%</span>
                  </div>
                  <div className="text-sm sm:text-lg font-black text-emerald-400 mt-1">
                    ₹{netProfitBenefit.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Metric 3: Cancelled / Refund Loss */}
                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-950/30 border border-rose-500/30">
                  <div className="flex items-center justify-between text-rose-300 text-[9px] sm:text-[11px] font-bold">
                    <span>Loss / Failed</span>
                    <span className="text-rose-400 font-black">{cancelledLossOrders.length} fails</span>
                  </div>
                  <div className="text-sm sm:text-lg font-black text-rose-400 mt-1">
                    ₹{cancelledLossAmount.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Metric 4: Online UPI vs Cash Split */}
                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-gray-400 text-[9px] sm:text-[11px] font-bold">
                    <span>Channel Split</span>
                    <span className="text-blue-300 font-black">UPI / COD</span>
                  </div>
                  <div className="text-[11px] sm:text-xs font-black text-white mt-1 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">₹{Math.round(onlinePaidTotal/1000)}k UPI</span>
                    <span className="text-gray-300 font-bold">₹{Math.round(codTotal/1000)}k COD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPACT QUICK CONSOLE HUB (Single-Line Horizontal Slider on Mobile, 6-Col Grid on Desktop) */}
            <div className="bg-white border border-gray-200/90 rounded-xl sm:rounded-[24px] p-2 sm:p-4 shadow-2xs space-y-1.5 sm:space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center">
                    <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <h2 className="text-[11px] sm:text-xs font-black text-gray-900 font-heading uppercase tracking-wide">
                    Quick Console Hub
                  </h2>
                  <span className="text-[7.5px] sm:text-[8.5px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600 font-black">
                    12 Modules
                  </span>
                </div>

                {/* Quick Action for Active Module */}
                <div className="flex items-center gap-1">
                  {activeTab === "chefSpecial" && (
                    <button
                      onClick={() => handleToggleChefSpecial(!chefSpecial.isActive)}
                      className={`h-6 px-2 rounded-lg text-white font-black text-[9.5px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer ${
                        chefSpecial.isActive
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <Power className="w-2.5 h-2.5" />
                      <span>{chefSpecial.isActive ? "Live" : "Hidden"}</span>
                    </button>
                  )}

                  {activeTab === "menu" && (
                    <button
                      onClick={() => setShowAddDishModal(true)}
                      className="h-6 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[9.5px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Dish</span>
                    </button>
                  )}

                  {activeTab === "trending" && (
                    <button
                      onClick={() => setShowAddTrendingModal(true)}
                      className="h-6 px-2 rounded-lg bg-gradient-to-r from-[#FF4D6D] to-[#FF6B35] text-white font-black text-[9.5px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Deal</span>
                    </button>
                  )}

                  {activeTab === "categories" && (
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="h-6 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[9.5px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Category</span>
                    </button>
                  )}

                  {activeTab === "feastBox" && (
                    <button
                      onClick={() => setShowAddFeastBoxModal(true)}
                      className="h-6 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[9.5px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Tier</span>
                    </button>
                  )}

                  {activeTab === "promos" && (
                    <button
                      onClick={() => setShowAddPromoModal(true)}
                      className="h-6 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[9.5px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ Voucher</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Mobile Phone View: Sleek Single-Line Horizontal Scroll Slider (md:hidden) */}
              <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5 -mx-1 px-1">
                {[
                  { id: "orders" as const, href: "/admin/orders", shortLabel: "Tickets", icon: ShoppingBag, count: `${orders.length}`, color: "text-[#FF6B35] bg-orange-50" },
                  { id: "menu" as const, href: "/admin/menu", shortLabel: "Menu", icon: UtensilsCrossed, count: `${products.length}`, color: "text-[#3ECF6E] bg-emerald-50" },
                  { id: "categories" as const, href: "/admin/categories", shortLabel: "Categories", icon: Tag, count: `${categories.length}`, color: "text-amber-500 bg-amber-50" },
                  { id: "chefSpecial" as const, href: "/admin/chef-special", shortLabel: "Chef", icon: Award, count: chefSpecial.isActive ? "👑" : "Off", color: "text-[#FF4D6D] bg-rose-50" },
                  { id: "trending" as const, href: "/admin/trending", shortLabel: "Deals", icon: Flame, count: `${trendingSpotlights.length}`, color: "text-[#FF8A00] bg-orange-50" },
                  { id: "feastBox" as const, href: "/admin/feast-box", shortLabel: "Feast Box", icon: Package, count: `${feastBoxTiers.length}`, color: "text-[#FF8A00] bg-amber-50" },
                  { id: "payments" as const, href: "/admin/payments", shortLabel: "Ledger", icon: CreditCard, count: `₹${Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / 1000)}k`, color: "text-[#3ECF6E] bg-emerald-50" },
                  { id: "settings" as const, href: "/admin/settings", shortLabel: "GST / Store", icon: SlidersHorizontal, count: `${settings.gstPercent}%`, color: "text-[#8B5CF6] bg-purple-50" },
                  { id: "reviews" as const, href: "/admin/reviews", shortLabel: "Reviews", icon: Star, count: `${reviews.length}`, color: "text-amber-500 bg-amber-50" },
                  { id: "promos" as const, href: "/admin/promos", shortLabel: "Vouchers", icon: Percent, count: `${promos.length}`, color: "text-[#FF6B35] bg-orange-50" },
                  { id: "inquiries" as const, href: "/admin/inquiries", shortLabel: "Inquiries", icon: Mail, count: `${inquiries.length}`, color: "text-[#0284C7] bg-sky-50" },
                  { id: "subscribers" as const, href: "/admin/subscribers", shortLabel: "VIP Club", icon: Users, count: `${subscribers.length}`, color: "text-[#6366F1] bg-indigo-50" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`h-8 px-2.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs text-left ${
                        isActive
                          ? "bg-[#0B1220] text-white border-[#FF6B35]/50 ring-1 ring-[#FF6B35]/40 font-black"
                          : "bg-white hover:bg-orange-50/60 text-gray-800 border-gray-200/90 font-bold"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${isActive ? "bg-[#FF6B35] text-white" : item.color}`}>
                        <Icon className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-[10px] font-black whitespace-nowrap">{item.shortLabel}</span>
                      <span className={`text-[8px] font-black px-1 py-0.2 rounded-full ${isActive ? "bg-white/20 text-[#FFC94A]" : "bg-gray-100 text-gray-500"}`}>
                        {item.count}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* 2. Desktop View: Grand 6-Column Grid (hidden md:grid) */}
              <div className="hidden md:grid md:grid-cols-6 gap-2">
                {[
                  { id: "orders" as const, href: "/admin/orders", shortLabel: "Tickets", label: "Kitchen Tickets", icon: ShoppingBag, count: `${orders.length} Orders`, color: "text-[#FF6B35] bg-orange-50 border border-orange-100" },
                  { id: "menu" as const, href: "/admin/menu", shortLabel: "Menu", label: "Menu Catalog", icon: UtensilsCrossed, count: `${products.length} Dishes`, color: "text-[#3ECF6E] bg-emerald-50 border border-emerald-100" },
                  { id: "categories" as const, href: "/admin/categories", shortLabel: "Categories", label: "Categories", icon: Tag, count: `${categories.length} Cats`, color: "text-amber-500 bg-amber-50 border border-amber-100" },
                  { id: "chefSpecial" as const, href: "/admin/chef-special", shortLabel: "Chef Royal 👑", label: "Chef Special 👑", icon: Award, count: chefSpecial.isActive ? "🟢 Live" : "🔴 Off", color: "text-[#FF4D6D] bg-rose-50 border border-rose-100" },
                  { id: "trending" as const, href: "/admin/trending", shortLabel: "Offers & Deals", label: "Offers & Deals", icon: Flame, count: `${trendingSpotlights.length} Deals`, color: "text-[#FF8A00] bg-orange-50 border border-orange-100" },
                  { id: "feastBox" as const, href: "/admin/feast-box", shortLabel: "Feast Box", label: "Feast Box", icon: Package, count: `${feastBoxTiers.length} Packs`, color: "text-[#FF8A00] bg-amber-50 border border-amber-100" },
                  { id: "payments" as const, href: "/admin/payments", shortLabel: "Ledger / Sales", label: "Payments Ledger", icon: CreditCard, count: `₹${Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / 1000)}k`, color: "text-[#3ECF6E] bg-emerald-50 border border-emerald-100" },
                  { id: "settings" as const, href: "/admin/settings", shortLabel: "GST / Config", label: "GST & Settings", icon: SlidersHorizontal, count: `${settings.gstPercent}% GST`, color: "text-[#8B5CF6] bg-purple-50 border border-purple-100" },
                  { id: "reviews" as const, href: "/admin/reviews", shortLabel: "Reviews", label: "Patron Reviews", icon: Star, count: `${reviews.length} Stars`, color: "text-amber-500 bg-amber-50 border border-amber-100" },
                  { id: "promos" as const, href: "/admin/promos", shortLabel: "Vouchers", label: "Promo Vouchers", icon: Percent, count: `${promos.length} Codes`, color: "text-[#FF6B35] bg-orange-50 border border-orange-100" },
                  { id: "inquiries" as const, href: "/admin/inquiries", shortLabel: "CRM Inquiries", label: "Inquiries CRM", icon: Mail, count: `${inquiries.length} Leads`, color: "text-[#0284C7] bg-sky-50 border border-sky-100" },
                  { id: "subscribers" as const, href: "/admin/subscribers", shortLabel: "VIP Club", label: "VIP Subscribers", icon: Users, count: `${subscribers.length} VIPs`, color: "text-[#6366F1] bg-indigo-50 border border-indigo-100" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`py-2 px-2 rounded-xl transition-all cursor-pointer border flex flex-col items-center justify-center text-center gap-0.5 active:scale-95 ${
                        isActive
                          ? "bg-[#0B1220] text-white border-[#FF6B35]/50 shadow-md scale-[1.02]"
                          : "bg-white hover:bg-orange-50/60 text-gray-800 border-gray-200/80 hover:border-orange-200 shadow-2xs"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? "bg-[#FF6B35] text-white shadow-xs border-0" : item.color
                      }`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="w-full overflow-hidden px-0.5">
                        <span className="font-black text-[10.5px] block truncate leading-tight mt-0.5">
                          {item.shortLabel}
                        </span>
                        <span className={`text-[8px] font-bold block truncate leading-none mt-0.5 ${isActive ? "text-orange-400" : "text-gray-400"}`}>
                          {item.count}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* DEDICATED STANDALONE MODULE BREADCRUMB & CONTROL STRIP */
          <div className="py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-sm flex items-center justify-between gap-2">
            
            {/* Left: Back + Icon + Title + Badge */}
            <div className="flex items-center gap-1.5 min-w-0">
              <Link
                href="/admin"
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-600 flex items-center justify-center transition-all cursor-pointer shrink-0 group"
                title="Back to Hub"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shrink-0">
                {activeTab === "menu" ? (
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                ) : activeTab === "orders" ? (
                  <ChefHat className="w-3.5 h-3.5" />
                ) : activeTab === "categories" ? (
                  <Tag className="w-3.5 h-3.5" />
                ) : activeTab === "trending" ? (
                  <Flame className="w-3.5 h-3.5" />
                ) : activeTab === "feastBox" ? (
                  <Package className="w-3.5 h-3.5" />
                ) : activeTab === "promos" ? (
                  <Percent className="w-3.5 h-3.5" />
                ) : (
                  <Layers className="w-3.5 h-3.5" />
                )}
              </div>

              <span className="text-[12px] sm:text-sm font-black text-gray-900 font-heading tracking-tight truncate">
                {activeTab === "menu"
                  ? "Menu"
                  : activeTab === "orders"
                  ? "Live Orders"
                  : activeTab === "categories"
                  ? "Categories"
                  : activeTab === "trending"
                  ? "Trending"
                  : activeTab === "feastBox"
                  ? "Feast Boxes"
                  : activeTab === "promos"
                  ? "Vouchers"
                  : activeTab === "chefSpecial"
                  ? "Chef Special"
                  : activeTab === "payments"
                  ? "Sales Ledger"
                  : activeTab === "settings"
                  ? "Settings"
                  : activeTab === "reviews"
                  ? "Reviews"
                  : activeTab === "inquiries"
                  ? "Inquiries"
                  : activeTab === "subscribers"
                  ? "VIP Club"
                  : "Admin"}
              </span>

              {(activeTab === "menu" || activeTab === "orders" || activeTab === "categories") && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-50 text-[#FF6B35] border border-orange-200/60 shrink-0">
                  {activeTab === "menu"
                    ? products.length
                    : activeTab === "orders"
                    ? orders.filter(o => o.status !== "DELIVERED").length
                    : categories.length}
                </span>
              )}
            </div>

            {/* Right: Action + Menu */}
            <div className="flex items-center gap-1 shrink-0">

              {activeTab === "orders" && (
                <button
                  onClick={() => setShowDayLockModal(true)}
                  className="h-7 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer"
                  title="Lock Shift"
                >
                  <LockKeyhole className="w-3 h-3" />
                  <span className="hidden sm:inline">Lock Shift</span>
                  <span className="sm:hidden">Lock</span>
                </button>
              )}

              {activeTab === "chefSpecial" && (
                <button
                  onClick={() => handleToggleChefSpecial(!chefSpecial.isActive)}
                  className={`h-7 px-2.5 rounded-lg text-white font-black text-[10px] flex items-center gap-1 cursor-pointer ${
                    chefSpecial.isActive
                      ? "bg-gradient-to-r from-[#3ECF6E] to-[#2E7D32]"
                      : "bg-gradient-to-r from-red-500 to-rose-600"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{chefSpecial.isActive ? "Live" : "Hidden"}</span>
                </button>
              )}

              {activeTab === "menu" && (
                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Dish</span>
                </button>
              )}

              {activeTab === "trending" && (
                <button
                  onClick={() => setShowAddTrendingModal(true)}
                  className="h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#FF4D6D] to-[#FF6B35] text-white font-black text-[10px] flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Deal</span>
                </button>
              )}

              {activeTab === "categories" && (
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add Category</span>
                </button>
              )}

              {activeTab === "feastBox" && (
                <button
                  onClick={() => setShowAddFeastBoxModal(true)}
                  className="h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Box</span>
                </button>
              )}

              {activeTab === "promos" && (
                <button
                  onClick={() => setShowAddPromoModal(true)}
                  className="h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] text-white font-black text-[10px] flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Voucher</span>
                </button>
              )}

              {/* Menu Drawer */}
              <button
                onClick={() => setShowMobileMoreMenu(true)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="All Modules"
              >
                <Menu className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: LIVE ORDERS & GPS RADAR */}
        {activeTab === "orders" && (() => {
          // Dynamic counts for stage & payment pills (accurately synced with active search & date context)
          const countActive = baseOrdersForFilter.filter((o) => o.status !== "DELIVERED").length;
          const countAll = countActive;
          const countReceived = baseOrdersForFilter.filter((o) => o.status === "ORDER_RECEIVED").length;
          const countPrep = baseOrdersForFilter.filter((o) => o.status === "CHEF_PREPARING").length;
          const countBake = baseOrdersForFilter.filter((o) => o.status === "WOOD_FIRED_BAKING").length;
          const countBike = baseOrdersForFilter.filter((o) => o.status === "COURIER_DISPATCHED").length;
          const countDelivered = baseOrdersForFilter.filter((o) => o.status === "DELIVERED").length;

          const countOnline = baseOrdersForFilter.filter((o) => !o.paymentMethod?.toLowerCase().includes("cod") && !o.paymentMethod?.toLowerCase().includes("cash") && o.status !== "DELIVERED").length;
          const countCodPaid = baseOrdersForFilter.filter((o) => (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && (o.paymentStatus === "PAID" || o.status === "DELIVERED")).length;
          const countCodPending = baseOrdersForFilter.filter((o) => (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && o.paymentStatus !== "PAID" && o.status !== "DELIVERED").length;

          return (
            <div className="space-y-2.5 sm:space-y-6">
              
              {/* Top Kitchen Dispatch Header & Master Action Bar (Shown only on master hub !standalone) */}
              {!standalone && (
                <div className="p-3 sm:p-7 rounded-xl sm:rounded-[32px] bg-gradient-to-r from-[#0B1220] via-[#162032] to-[#0B1220] text-white flex items-center justify-between gap-2 shadow-xl border border-white/10 relative overflow-hidden">
                  {/* Background ambient glow */}
                  <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-10 w-60 h-60 bg-[#FF8A00]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Left: Branding & Status */}
                  <div className="space-y-0.5 sm:space-y-1 relative z-10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF8A00] text-[8px] sm:text-[10px] font-black uppercase tracking-wider border border-[#FF6B35]/30">
                        <Flame className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#FF6B35]" /> Live Kitchen
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] sm:text-[10px] font-black border border-emerald-500/30">
                        <span className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {countActive} Active Tickets
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-2xl lg:text-3xl font-black font-heading tracking-tight text-white flex items-center gap-2">
                      <span>Kitchen Tickets & Live Orders</span>
                    </h3>
                  </div>

                  {/* Right: Master Control Capsule Toolbar */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5 relative z-10 shrink-0">
                    <button
                      onClick={() => setShowDayLockModal(true)}
                      className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-[10px] sm:text-xs shadow-glow transition-all flex items-center gap-1 active:scale-95 cursor-pointer border border-[#FF8A00]/40"
                      title="Lock hotel shift & print Official Daily Closing Z-Report"
                    >
                      <LockKeyhole className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Lock Shift</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Master Filter Hub Card (Ultra Mobile Optimized) */}
              <div className="p-2 sm:p-5 rounded-xl sm:rounded-[28px] bg-white border border-gray-200/90 shadow-soft-card space-y-1.5 sm:space-y-3">
                
                {/* TIER 1: Search & Date Range Switcher */}
                <div className="flex flex-col lg:flex-row gap-1.5 sm:gap-3 items-stretch lg:items-center justify-between pb-1.5 sm:pb-3 border-b border-gray-100">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-lg">
                    <input
                      type="text"
                      placeholder="Search Order #, Name, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-2.5 py-1.5 sm:py-2 pl-7 sm:pl-9 pr-7 rounded-xl bg-gray-50/90 border border-gray-200 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all shadow-2xs"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 sm:left-3 top-2 sm:top-2.5" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1.5 sm:top-2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Date Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                    <span className="text-[8.5px] sm:text-[10px] font-black uppercase text-gray-400 mr-0.5 flex items-center gap-0.5 shrink-0">
                      <Calendar className="w-2.5 h-2.5 text-[#FF6B35]" /> Date:
                    </span>
                    {[
                      { label: "Today", value: "TODAY" },
                      { label: "Yesterday", value: "YESTERDAY" },
                      { label: "7 Days", value: "LAST_7_DAYS" },
                      { label: "All Time", value: "ALL" },
                      { label: "Custom", value: "CUSTOM" },
                    ].map((df) => (
                      <button
                        key={df.value}
                        onClick={() => setOrderDateFilter(df.value as any)}
                        className={`px-2 py-0.5 sm:py-1 rounded-lg text-[9.5px] sm:text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                          orderDateFilter === df.value
                            ? "bg-[#0B1220] text-white shadow-2xs scale-102"
                            : "bg-gray-100/90 hover:bg-gray-200 text-gray-700 border border-transparent"
                        }`}
                      >
                        {df.label}
                      </button>
                    ))}

                    {orderDateFilter === "CUSTOM" && (
                      <input
                        type="date"
                        value={customFilterDate}
                        onChange={(e) => setCustomFilterDate(e.target.value)}
                        className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[10px] sm:text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    )}
                  </div>
                </div>

                {/* TIER 2: Cooking & Delivery Stages */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                    <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-0.5 shrink-0 mr-1">
                      <Flame className="w-2.5 h-2.5 text-[#FF6B35]" /> Stages:
                    </span>
                    {[
                      { label: "Active Tickets", value: "ALL", count: countActive },
                      { label: "1. Received", value: "ORDER_RECEIVED", count: countReceived },
                      { label: "2. Cooking", value: "CHEF_PREPARING", count: countPrep },
                      { label: "3. Baking", value: "WOOD_FIRED_BAKING", count: countBake },
                      { label: "4. On Bike", value: "COURIER_DISPATCHED", count: countBike },
                      { label: "5. Delivered", value: "DELIVERED", count: countDelivered },
                    ].map((st) => {
                      const isActive = statusFilter === st.value;
                      return (
                        <button
                          key={st.value}
                          onClick={() => setStatusFilter(st.value)}
                          className={`px-2 py-0.5 sm:py-1 rounded-lg text-[9.5px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer border shrink-0 whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white border-transparent shadow-2xs scale-102"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/80 hover:border-gray-300"
                          }`}
                        >
                          <span>{st.label}</span>
                          <span className={`text-[8px] sm:text-[9.5px] px-1 py-0.1 rounded font-bold ${
                            isActive ? "bg-white/25 text-white" : "bg-gray-200/80 text-gray-600"
                          }`}>
                            {st.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TIER 3: Payment Channel */}
                <div className="space-y-1 pt-1 sm:pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
                    <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-0.5 shrink-0 mr-1">
                      <CreditCard className="w-2.5 h-2.5 text-[#3ECF6E]" /> Pay:
                    </span>
                    {[
                      { label: "All", value: "ALL", count: countAll },
                      { label: "⚡ UPI Paid", value: "ONLINE_PAID", count: countOnline },
                      { label: "💵 COD Paid", value: "COD_PAID", count: countCodPaid },
                      { label: "⏳ Pending", value: "COD_PENDING", count: countCodPending },
                    ].map((pm) => {
                      const isActive = orderPaymentFilter === pm.value;
                      return (
                        <button
                          key={pm.value}
                          onClick={() => setOrderPaymentFilter(pm.value as any)}
                          className={`px-2 py-0.5 sm:py-1 rounded-lg text-[9.5px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer border shrink-0 whitespace-nowrap ${
                            isActive
                              ? "bg-[#0B1220] text-white border-transparent shadow-2xs scale-102"
                              : pm.value === "COD_PENDING" && countCodPending > 0
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200/80"
                          }`}
                        >
                          <span>{pm.label}</span>
                          <span className={`text-[8px] sm:text-[9.5px] px-1 py-0.1 rounded font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : pm.value === "COD_PENDING" && countCodPending > 0
                              ? "bg-amber-200 text-amber-900 font-black animate-pulse"
                              : "bg-gray-200/80 text-gray-600"
                          }`}>
                            {pm.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Orders Cards Grid (Ultra-Compact High-Density Cards on Phone) */}
              <div className="space-y-1.5 sm:space-y-3">
                {filteredOrders.length > 0 ? (
                filteredOrders.map((order, orderIdx) => {
                  const isCod = order.paymentMethod?.toLowerCase().includes("cod") || order.paymentMethod?.toLowerCase().includes("cash");
                  const isCodPaid = isCod && (order.paymentStatus === "PAID" || order.status === "DELIVERED");
                  const isOnlinePaid = !isCod;

                  return (
                    <div
                      key={order.id}
                      className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white border transition-all space-y-1.5 ${
                        orderIdx === 0
                          ? "border-[#FF6B35] shadow-xs ring-1 ring-[#FF6B35]/30"
                          : "border-gray-200/90 shadow-2xs hover:shadow-soft-card"
                      }`}
                    >
                      {/* ROW 1: ID Badge + Patron Name + Payment Status + Total + Actions */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div 
                          onClick={() => setSelectedOrderDetails(order)}
                          className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer group hover:opacity-90 transition-opacity"
                          title="Click to view complete order details & customer history"
                        >
                          <span className="px-1.5 py-0.5 rounded-md bg-[#FFF0E5] text-[#FF6B35] font-black text-[10px] sm:text-xs shrink-0 group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                            #{order.id.slice(-4)}
                          </span>
                          <span className="font-black text-gray-900 text-xs sm:text-sm font-heading truncate group-hover:text-[#FF6B35] transition-colors">
                            {order.customerName}
                          </span>
                          {isOnlinePaid ? (
                            <span className="text-[7.5px] font-black px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              ⚡ UPI
                            </span>
                          ) : isCodPaid ? (
                            <span className="text-[7.5px] font-black px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              ✓ COD
                            </span>
                          ) : (
                            <span className="text-[7.5px] font-black px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-300 animate-pulse shrink-0">
                              ⏳ Due
                            </span>
                          )}
                        </div>

                        {/* Right: Total Price + Quick Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="text-xs sm:text-sm font-black text-[#FF6B35] font-heading mr-0.5 cursor-pointer hover:underline"
                            title="Click to inspect order breakdown"
                          >
                            ₹{order.total}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadOrderReceipt({
                                orderId: order.id,
                                customerName: order.customerName,
                                phone: order.phone,
                                address: order.address,
                                items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
                                subtotal: order.subtotal,
                                discount: order.discount,
                                shipping: order.deliveryFee,
                                tax: order.tax,
                                gstPercent: settings.gstPercent || 5,
                                total: order.total,
                                paymentMethod: isCod ? (isCodPaid ? "Cash on Delivery (Paid)" : "Cash on Delivery (Pending)") : order.paymentMethod,
                                date: new Date(order.createdAt).toLocaleString("en-IN"),
                              });
                            }}
                            className="p-1 rounded-md bg-gray-50 hover:bg-orange-50 text-gray-700 border border-gray-200 transition-all cursor-pointer"
                            title="Print Tax Receipt"
                          >
                            <Printer className="w-3 h-3 text-[#FF6B35]" />
                          </button>

                          <Link
                            href={`/track/${order.id}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white shadow-2xs transition-all flex items-center justify-center cursor-pointer"
                            title="Live Delivery Radar"
                          >
                            <Bike className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* ROW 2: Items Summary Bar + Phone + Time (Clickable for details) */}
                      <div 
                        onClick={() => setSelectedOrderDetails(order)}
                        className="flex items-center justify-between gap-1 text-[10px] text-gray-600 bg-[#FFF8F2] hover:bg-orange-50/80 px-2 py-1 rounded-lg border border-orange-100/80 cursor-pointer transition-colors group"
                        title="Click to view all ordered items & customer history"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="font-black text-[#FF6B35] text-[9px] shrink-0">
                            {order.items?.length || 0} Items:
                          </span>
                          <span className="font-bold text-gray-800 truncate block text-[10px] group-hover:text-black">
                            {order.items?.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-[9px] text-gray-400">
                          <span className="flex items-center gap-0.5 text-gray-600 font-bold">
                            <Phone className="w-2.5 h-2.5 text-[#FF6B35]" /> {order.phone}
                          </span>
                          <span>
                            {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </span>
                        </div>
                      </div>

                      {/* ROW 3: COD Payment Approval Alert (if pending) */}
                      {isCod && !isCodPaid && (
                        <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-bold text-amber-900">💵 Collect ₹{order.total} Cash</span>
                          <button
                            onClick={() => handleApproveCodPayment(order.id)}
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] cursor-pointer"
                          >
                            ✓ Approve Cash
                          </button>
                        </div>
                      )}

                      {/* ROW 4: 5-Stage Connected Pipeline Advancer */}
                      <div className="grid grid-cols-5 gap-1 pt-0.5">
                        {[
                          { label: "1. Received", status: "ORDER_RECEIVED" as OrderStatus },
                          { label: "2. Prep", status: "CHEF_PREPARING" as OrderStatus },
                          { label: "3. Baking", status: "WOOD_FIRED_BAKING" as OrderStatus },
                          { label: "4. Bike", status: "COURIER_DISPATCHED" as OrderStatus },
                          { label: "5. Done", status: "DELIVERED" as OrderStatus },
                        ].map((st) => (
                          <button
                            key={st.status}
                            onClick={() => handleUpdateOrderStatus(order.id, st.status)}
                            className={`py-1 text-center rounded-md text-[8.5px] sm:text-[10px] font-black transition-all cursor-pointer truncate ${
                              order.status === st.status
                                ? "bg-[#3ECF6E] text-white shadow-2xs font-black"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="p-12 rounded-3xl bg-white/90 border border-gray-150 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-gray-900">No orders found in this stage / filter</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Currently no orders match the selected stage or payment channel. Click below to reset filters or generate a test order.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                    <button
                      onClick={() => {
                        setStatusFilter("ALL");
                        setOrderPaymentFilter("ALL");
                        setOrderDateFilter("ALL");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs transition-all cursor-pointer shadow-sm"
                    >
                      ↺ Reset All Filters
                    </button>
                    <button
                      onClick={handleQuickSeedOrder}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs shadow-glow transition-all active:scale-95 cursor-pointer"
                    >
                      + Generate Test Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          );
        })()}

        {/* TAB 2: MENU DISHES */}
        {activeTab === "menu" && (
          <div className="space-y-2.5 sm:space-y-4">
            {/* Mobile Floating Action Button (FAB) for Instant 1-Tap Add Dish */}
            <button
              onClick={() => setShowAddDishModal(true)}
              className="fixed bottom-20 right-4 z-40 sm:hidden w-13 h-13 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white shadow-2xl flex items-center justify-center active:scale-90 transition-all border-2 border-white cursor-pointer shadow-orange-500/40"
              title="Add New Dish"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Mobile-Friendly Search & Filter Hub */}
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/90 shadow-2xs space-y-2">
              
              {/* Row 1: Clean Search Input + Prominent Add Dish Button + Quick Count */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search dishes or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 sm:h-10 px-3 pl-8 pr-7 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5 sm:top-3 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 sm:top-2.5 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Prominent + Add Dish Button */}
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(true)}
                  className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs flex items-center gap-1.5 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Add Dish</span>
                </button>

                <div className="px-2.5 sm:px-3 h-9 sm:h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#FF6B35] text-xs font-black flex items-center justify-center shrink-0">
                  {filteredProducts.length} <span className="hidden sm:inline ml-1">Dishes</span>
                </div>
              </div>

              {/* Row 2: Unified Compact Horizontal Filter Strip (Categories + Price Filters) */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[10px]">
                {/* Category Pills */}
                {[
                  { label: "All", value: "All Dishes" },
                  { label: "🍔 Burgers", value: "Burgers & Wraps" },
                  { label: "🍕 Pizzas", value: "Pizzas & Garlic Breads" },
                  { label: "🍟 Snacks", value: "Snacks & Chaat" },
                  { label: "🥢 Chinese", value: "Chinese & Momos" },
                  { label: "🍚 Biryani", value: "Biryani & North Indian" },
                  { label: "🟡 Gujarati", value: "Gujarati & Thalis" },
                  { label: "🥥 South", value: "South Indian" },
                  { label: "☕ Chai", value: "Chai, Coffee & Juices" },
                  { label: "🍰 Desserts", value: "Desserts & Shakes" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setMenuFilterCategory(cat.value)}
                    className={`h-6 px-2 rounded-full font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center ${
                      menuFilterCategory === cat.value
                        ? "bg-[#FF6B35] text-white font-black shadow-2xs"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/70"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}

                <span className="w-px h-3.5 bg-gray-200 mx-0.5 shrink-0" />

                {/* Price Pills */}
                {[
                  { label: "⚡ <₹199", value: "199" },
                  { label: "🔥 <₹299", value: "299" },
                  { label: "👑 <₹399", value: "399" },
                ].map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setMenuFilterBudget(menuFilterBudget === b.value ? "all" : b.value)}
                    className={`h-6 px-2 rounded-full font-black transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center ${
                      menuFilterBudget === b.value
                        ? "bg-[#0B1220] text-white shadow-2xs"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200/50"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Inline Category Manager Drawer (toggled from Command Hub) */}
            {showCategoryManager && (
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-xl border border-amber-200/80 shadow-2xs space-y-2 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FFC94A] to-[#FF8A00] flex items-center justify-center text-white">
                      <Tag className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 font-heading">Category Manager</h4>
                      <p className="text-[8px] text-gray-500 font-bold">{categories.length} categories</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-[9.5px] font-black flex items-center gap-0.5 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>+ New</span>
                    </button>
                    <button
                      onClick={() => setShowCategoryManager(false)}
                      className="p-1 rounded-full hover:bg-white/80 text-gray-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {categories.map((cat) => {
                    const dishCount = products.filter((p) => p.category === cat.name).length;
                    return (
                      <div
                        key={cat.id}
                        className={`p-2 rounded-lg border transition-all duration-300 flex flex-col justify-between relative bg-gradient-to-b ${cat.bgGradient || "from-[#FFF0E5] to-[#FFE4D6]"} ${cat.borderColor || "border-[#FF6B35]/40"} shadow-2xs`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[7.5px] font-black px-1 py-0.2 rounded-full bg-white/90 text-gray-700 shadow-2xs">
                              #{cat.priority || 1}
                            </span>
                            <button
                              onClick={() => handleToggleCategoryStatus(cat.id, cat.isActive !== false)}
                              className={`text-[7.5px] font-black px-1 py-0.2 rounded-full transition-all cursor-pointer shadow-2xs ${
                                cat.isActive !== false
                                  ? "bg-[#3ECF6E] text-white"
                                  : "bg-gray-400 text-white"
                              }`}
                            >
                              {cat.isActive !== false ? "● LIVE" : "○ OFF"}
                            </button>
                          </div>

                          <div className="flex flex-col items-center text-center my-0.5">
                            <div className="w-6 h-6 rounded-full bg-white shadow-2xs border border-black/5 flex items-center justify-center text-xs mb-0.5">
                              {cat.emoji}
                            </div>
                            <h4 className="font-black text-gray-900 text-[10px] font-heading leading-tight truncate w-full">
                              {cat.name}
                            </h4>
                            <p className="text-[8px] text-gray-500 font-bold">
                              {dishCount} items
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 pt-1 border-t border-black/5 mt-0.5">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="flex-1 py-0.5 rounded bg-white hover:bg-gray-50 text-gray-900 text-[8px] font-black flex items-center justify-center gap-0.5 shadow-2xs border border-black/5 cursor-pointer"
                          >
                            <Edit3 className="w-2 h-2 text-[#FF6B35]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-0.5 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-2 h-2" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Menu Grid (Ultra-Compact 2-Column on Mobile, 4-Column on Desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
              {filteredProducts.map((dish) => (
                <div
                  key={dish.id}
                  className="p-1.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    {/* Dish Image + In-Image Overlays */}
                    <div className="relative h-24 sm:h-36 lg:h-40 rounded-lg sm:rounded-xl overflow-hidden shadow-2xs bg-gray-100">
                      <img
                        src={dish.images?.[0] || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800"}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Top-Left Category Badge */}
                      <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-full bg-black/75 text-white backdrop-blur-xs text-[7.5px] font-black truncate max-w-[65%]">
                        {dish.category}
                      </span>

                      {/* Top-Right Interactive Stock Status Toggle */}
                      <button
                        onClick={() => handleToggleDishStock(dish.id, dish.inStock === false ? true : false)}
                        className={`absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[7.5px] font-black transition-all flex items-center gap-0.5 cursor-pointer shadow-2xs ${
                          dish.inStock !== false
                            ? "bg-emerald-600/95 text-white backdrop-blur-xs hover:bg-red-600"
                            : "bg-red-600/95 text-white backdrop-blur-xs hover:bg-emerald-600 animate-pulse"
                        }`}
                        title="Toggle Stock Status"
                      >
                        <span className="w-1 h-1 rounded-full bg-white" />
                        <span>{dish.inStock !== false ? "In Stock" : "Sold Out"}</span>
                      </button>

                      {/* Bottom-Right Price Badge */}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-full bg-[#FF6B35] text-white text-[9.5px] sm:text-xs font-black shadow-2xs font-heading">
                        ₹{dish.price}
                      </span>
                    </div>

                    {/* Dish Title & Micro Info */}
                    <div>
                      <h4 className="font-black text-gray-900 text-[11px] sm:text-xs font-heading line-clamp-1 leading-tight">
                        {dish.name}
                      </h4>
                      <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] text-gray-400 font-bold mt-0.5">
                        <span className="text-[#FF6B35] font-black">₹{dish.price}</span>
                        <span>⏱️ {dish.prepTimeMinutes || 15}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact 1-Row Action Bar */}
                  <div className="flex items-center gap-1 pt-1 border-t border-gray-100 mt-1">
                    {/* Add-ons button */}
                    <button
                      onClick={() => handleOpenCustomizationManager(dish)}
                      className="flex-1 h-6 rounded-md bg-orange-50 hover:bg-orange-100 text-[#FF6B35] text-[8px] sm:text-[9.5px] font-black flex items-center justify-center gap-0.5 border border-orange-200/60 cursor-pointer active:scale-95"
                      title="Customization Add-ons"
                    >
                      <Sliders className="w-2 h-2" />
                      <span>Add-ons</span>
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => setEditingDish(dish)}
                      className="flex-1 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-[8px] sm:text-[9.5px] font-black flex items-center justify-center gap-0.5 cursor-pointer active:scale-95"
                      title="Edit Dish"
                    >
                      <Edit3 className="w-2 h-2 text-[#FF6B35]" />
                      <span>Edit</span>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteDish(dish.id, dish.name)}
                      className="w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: CATEGORIES STUDIO & CUISINE MANAGER */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            
            {/* Header Banner (Shown only on master hub) */}
            {!standalone && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#1A1208] via-[#2A1E0E] to-[#1A1208] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border border-amber-500/20">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC94A]/20 text-[#FFC94A] text-[10px] font-black uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 fill-[#FFC94A]" /> Menu Navigation & Categories
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-heading">
                    Category Studio & Cuisine Manager
                  </h3>
                  <p className="text-xs text-gray-300 max-w-xl">
                    Create new food categories, change emojis, edit titles & subtitles, adjust priority sorting, or delete categories. Changes reflect live on the homepage carousel!
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Category</span>
                </button>
              </div>
            )}

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-white border border-gray-100 shadow-2xs flex flex-col gap-0.5">
                <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-gray-400 leading-tight">Total</span>
                <p className="text-sm sm:text-lg font-black text-gray-900">{categories.length}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-white border border-gray-100 shadow-2xs flex flex-col gap-0.5">
                <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-green-500 leading-tight">Live</span>
                <p className="text-sm sm:text-lg font-black text-green-600">
                  {categories.filter(c => c.isActive !== false).length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-white border border-gray-100 shadow-2xs flex flex-col gap-0.5">
                <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-gray-400 leading-tight">Draft</span>
                <p className="text-sm sm:text-lg font-black text-gray-400">
                  {categories.filter(c => c.isActive === false).length}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-white border border-gray-100 shadow-2xs flex flex-col gap-0.5">
                <span className="text-[7.5px] sm:text-[9px] font-black uppercase text-[#FF6B35] leading-tight">Dishes</span>
                <p className="text-sm sm:text-lg font-black text-[#FF6B35]">{products.length}</p>
              </div>
            </div>

            {/* Categories Grid — Ultra Compact */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
              {categories.map((cat) => {
                const dishCount = products.filter((p) => p.category?.toLowerCase() === cat.name.toLowerCase() || p.category === cat.name).length;
                return (
                  <div
                    key={cat.id}
                    className={`p-2 rounded-xl border transition-all duration-300 flex flex-col gap-1.5 relative bg-gradient-to-b ${cat.bgGradient || "from-[#FFF0E5] to-[#FFE4D6]"} ${cat.borderColor || "border-[#FF6B35]/30"} group`}
                  >
                    {/* Top row: # badge + LIVE toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-black px-1 py-0.5 rounded-full bg-white/90 text-gray-500 border border-black/5">
                        #{cat.priority || 1}
                      </span>
                      <button
                        onClick={() => handleToggleCategoryStatus(cat.id, cat.isActive !== false)}
                        className={`text-[7px] font-black px-1.5 py-0.5 rounded-full cursor-pointer ${
                          cat.isActive !== false
                            ? "bg-[#3ECF6E] text-white"
                            : "bg-gray-300 text-white"
                        }`}
                        title="Toggle visibility"
                      >
                        {cat.isActive !== false ? "● LIVE" : "○ OFF"}
                      </button>
                    </div>

                    {/* Middle: emoji + name + subtitle inline */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center text-base shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                        {cat.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-gray-900 text-[10px] leading-tight truncate">
                          {cat.name}
                        </p>
                        <p className="text-[8px] text-gray-500 font-medium truncate leading-tight">
                          {cat.subtitle}
                        </p>
                        <span className="text-[7.5px] font-bold text-gray-500">
                          🍲 {dishCount} dish{dishCount !== 1 ? "es" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 border-t border-black/5 pt-1.5">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="flex-1 py-0.5 rounded-md bg-white/90 hover:bg-white text-gray-800 text-[8.5px] font-black flex items-center justify-center gap-0.5 transition-colors cursor-pointer border border-black/5"
                      >
                        <Edit3 className="w-2 h-2 text-[#FF6B35]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-400 border border-red-100 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: TRENDING SPOTLIGHTS & TODAY'S DEALS */}
        {activeTab === "trending" && (
          <div className="space-y-2.5 sm:space-y-4">
            
            {/* Header Banner */}
            {!standalone && (
              <div className="p-3.5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1A0B12] via-[#2A121E] to-[#1A0B12] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-md border border-rose-500/20">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] text-[9px] font-black uppercase tracking-wider">
                    <Flame className="w-2.5 h-2.5 fill-[#FF4D6D]" /> Viral Deals & Offers
                  </div>
                  <h3 className="text-sm sm:text-xl font-black font-heading">
                    Trending Spotlight Manager
                  </h3>
                  <p className="text-[11px] text-gray-300 max-w-xl hidden sm:block">
                    Feature dishes in the homepage spotlight with custom offer ribbons.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTrendingModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#FF6B35] text-white font-black text-[11px] shadow-glow flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Feature Dish</span>
                </button>
              </div>
            )}

            {/* Live 4-Dish Showcase Preview Bar */}
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200/80 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-800 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate">🌐 Top {trendingSpotlights.filter(s => s.isActive !== false).length} Dishes Live on Homepage</span>
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] font-black text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                ⚡ Real-Time Sync
              </span>
            </div>

            {/* Trending Items Grid (Compact 2-Col on Mobile, 4-Col on Desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {trendingSpotlights.map((spotlight, index) => {
                const dish = spotlight.product || products.find(p => p.id === spotlight.productId) || products[0];

                return (
                  <div
                    key={spotlight.id}
                    className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-rose-100 shadow-soft-card hover:shadow-glow transition-all flex flex-col justify-between group relative overflow-hidden space-y-1.5"
                  >
                    {/* Top Offer Tag Ribbon */}
                    <div className="w-full bg-gradient-to-r from-[#FF4D6D] to-[#FF6B35] text-white px-1.5 py-0.5 rounded-md text-[7.5px] sm:text-[8.5px] font-black uppercase text-center truncate shadow-2xs">
                      {spotlight.customOfferTag || "🔥 TODAY'S SPECIAL"}
                    </div>

                    <div className="space-y-1.5">
                      {/* Image Frame */}
                      <div className="relative h-24 sm:h-32 rounded-lg overflow-hidden bg-gray-100 shadow-2xs">
                        <img
                          src={dish?.images?.[0] || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800"}
                          alt={dish?.name || "Dish"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-[#0B1220]/80 text-white backdrop-blur-xs text-[7.5px] font-black">
                          #{spotlight.priority || index + 1}
                        </span>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-full bg-[#FF6B35] text-white text-[9.5px] font-black shadow-xs font-heading">
                          ₹{dish?.price || 299}
                        </span>
                      </div>

                      {/* Details */}
                      <div>
                        <h4 className="font-black text-gray-900 text-[11px] sm:text-xs font-heading truncate leading-tight">{dish?.name}</h4>
                        <p className="text-[8.5px] sm:text-[9.5px] text-gray-500 truncate">{dish?.category}</p>
                      </div>

                      {/* Live Toggle on Storefront */}
                      <button
                        onClick={() => handleToggleTrendingStatus(spotlight.id, spotlight.isActive !== false)}
                        className={`w-full py-0.5 rounded-md text-[8px] sm:text-[8.5px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                          spotlight.isActive !== false
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        <span>{spotlight.isActive !== false ? "● LIVE" : "○ PAUSED"}</span>
                      </button>
                    </div>

                    {/* Bottom Actions: Edit Offer + Delete */}
                    <div className="flex items-center gap-1 pt-1.5 border-t border-gray-100">
                      <button
                        onClick={() => setEditingTrendingSpotlight(spotlight)}
                        className="flex-1 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-[9px] sm:text-[10px] font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-2.5 h-2.5 text-[#FF6B35]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTrendingSpotlight(spotlight.id, dish?.name)}
                        className="h-6 px-2 rounded-md bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors cursor-pointer flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: CUSTOMER RATINGS & REVIEWS (MODERATION & FEEDBACK) */}
        {activeTab === "reviews" && (
          <div className="space-y-2.5 sm:space-y-4">
            
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0B1220] to-[#1E293B] text-white flex items-center justify-between gap-2 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                  ))}
                  <span className="text-[10px] font-black text-white ml-1">
                    Patron Feedback ({stats?.averageRating || "4.98"} ★)
                  </span>
                </div>
                <p className="text-[9px] text-gray-300">
                  {reviews.length} Verified customer tasting reviews
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-lg bg-[#3ECF6E]/20 text-[#3ECF6E] font-black text-[8.5px] sm:text-[9.5px] border border-[#3ECF6E]/30 shrink-0">
                ● 100% Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-2.5 sm:p-3.5 rounded-xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-soft-card transition-all flex flex-col justify-between space-y-1.5"
                >
                  <div className="space-y-1.5">
                    
                    {/* Top Row: Stars + Mood + Delete */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-sm">{rev.moodEmoji || "👑"}</span>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="w-5 h-5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dish Tag */}
                    {rev.favoriteDish && (
                      <span className="inline-block px-1.5 py-0.2 rounded-md bg-[#FFF0E5] text-[#FF6B35] text-[8.5px] font-black border border-[#FF6B35]/20 truncate max-w-full">
                        🍱 {rev.favoriteDish}
                      </span>
                    )}

                    {/* Comment */}
                    <p className="text-[10px] sm:text-[11px] text-gray-800 leading-snug font-medium">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    {/* Tags */}
                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rev.tags.map((t, idx) => (
                          <span key={idx} className="text-[7.5px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Bottom Footer: Customer Name & Date */}
                  <div className="border-t border-gray-100 pt-1.5 flex items-center justify-between text-[9px] text-gray-400">
                    <span className="font-bold text-gray-800 text-[9.5px]">{rev.customerName}</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: FEAST BOX TIERS & PERCENTAGES */}
        {activeTab === "feastBox" && (
          <div className="space-y-2.5 sm:space-y-4">
            
            {/* Header Banner */}
            {!standalone && (
              <div className="p-3.5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#12121A] via-[#2A1E24] to-[#12121A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-md border border-white/10">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] text-[9px] font-black uppercase tracking-wider">
                    <Percent className="w-2.5 h-2.5" /> Tiered Discount Engine
                  </div>
                  <h3 className="text-sm sm:text-xl font-black font-heading">
                    Feast Box Discount Packs
                  </h3>
                  <p className="text-[11px] text-gray-300 max-w-xl hidden sm:block">
                    Configure dish counts, discount percentages, and complimentary gifts.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddFeastBoxModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-glow flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Create Box</span>
                </button>
              </div>
            )}

            {/* Feast Box Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {feastBoxTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-gray-200/90 shadow-soft-card hover:shadow-glow transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Top Badges & Savings Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#FFF0E5] text-[#FF6B35] font-black text-[10px] font-heading border border-orange-100">
                          📦 {tier.count} Dishes Box
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black">
                          {tier.badge || `${tier.discountPercent}% OFF`}
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-black text-[#FF6B35] font-heading shrink-0">
                        {tier.discountPercent}% OFF
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-gray-900 font-heading leading-tight">
                        {tier.title}
                      </h4>
                      <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                        🔥 Instant {tier.discountPercent}% Savings on custom selection
                      </p>
                    </div>

                    {/* Gift perk */}
                    <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200/60 text-[10.5px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{tier.gift || "Complimentary Chef Special Gift"}</span>
                    </div>

                    {/* Bullet perks (if any) */}
                    {tier.freeGifts && tier.freeGifts.length > 0 && (
                      <ul className="space-y-0.5 text-[10px] text-gray-600 font-medium pt-0.5">
                        {tier.freeGifts.map((g, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions (Edit & Delete) */}
                  <div className="border-t border-gray-100 pt-2 flex items-center gap-1.5 mt-1">
                    <button
                      onClick={() => setEditingFeastBoxTier(tier)}
                      className="flex-1 h-7.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10.5px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#FF6B35]" />
                      <span>Edit (%)</span>
                    </button>

                    <button
                      onClick={() => handleDeleteFeastBoxTier(tier.id, tier.title)}
                      className="h-7.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 text-[10.5px] font-black transition-all flex items-center justify-center cursor-pointer"
                      title="Delete Tier"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}


        {/* TAB: PAYMENTS & GST LEDGER */}
        {activeTab === "payments" && (() => {
          const onlinePaidTotal = orders
            .filter((o) => !o.paymentMethod?.toLowerCase().includes("cod") && !o.paymentMethod?.toLowerCase().includes("cash"))
            .reduce((sum, o) => sum + (o.total || 0), 0);

          const codCollectedTotal = orders
            .filter((o) => (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && (o.paymentStatus === "PAID" || o.status === "DELIVERED"))
            .reduce((sum, o) => sum + (o.total || 0), 0);

          const codPendingTotal = orders
            .filter((o) => (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && o.paymentStatus !== "PAID" && o.status !== "DELIVERED")
            .reduce((sum, o) => sum + (o.total || 0), 0);

          const totalBilledRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

          return (
            <div className="space-y-3 sm:space-y-6">
              
              {/* Header Banner */}
              {!standalone && (
                <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-[#0B1220] via-[#1E293B] to-[#0B1220] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl border border-white/10">
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3ECF6E]/20 text-[#3ECF6E] text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                      <CreditCard className="w-3 h-3" /> Financial & Payment Ledger
                    </div>
                    <h3 className="text-base sm:text-2xl font-black font-heading">
                      Payments & Cash Collections
                    </h3>
                    <p className="text-xs text-gray-300 max-w-xl hidden sm:block">
                      Inspect Online UPI vs Cash on Delivery, verify GST collected per order, approve cash payments, and reprint official tax receipts.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => setShowDayLockModal(true)}
                      className="flex-1 sm:flex-initial px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] sm:text-xs shadow-glow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LockKeyhole className="w-3.5 h-3.5" />
                      <span>Lock Day</span>
                    </button>

                    <button
                      onClick={() => fetchAdminData(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      <span>Sync</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Financial KPI Summary Cards (4 Channels - Ultra-Compact on Mobile) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {/* Total Gross Sales */}
                <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-0.5 sm:space-y-1">
                  <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block truncate">Total Revenue</span>
                  <div className="text-sm sm:text-2xl font-black text-gray-900 font-heading">
                    ₹{totalBilledRevenue.toLocaleString()}
                  </div>
                  <span className="text-[8.5px] sm:text-[10px] text-gray-500 font-bold block truncate">
                    {orders.length} Orders Billed
                  </span>
                </div>

                {/* Online / UPI Collections */}
                <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-0.5 sm:space-y-1">
                  <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block truncate">⚡ Online / UPI</span>
                  <div className="text-sm sm:text-2xl font-black text-emerald-600 font-heading">
                    ₹{onlinePaidTotal.toLocaleString()}
                  </div>
                  <span className="text-[8.5px] sm:text-[10px] text-emerald-600 font-bold flex items-center gap-1 truncate">
                    ✓ Verified Paid
                  </span>
                </div>

                {/* Cash on Delivery (Collected) */}
                <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-0.5 sm:space-y-1">
                  <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 block truncate">💵 COD Received</span>
                  <div className="text-sm sm:text-2xl font-black text-emerald-700 font-heading">
                    ₹{codCollectedTotal.toLocaleString()}
                  </div>
                  <span className="text-[8.5px] sm:text-[10px] text-emerald-700 font-bold flex items-center gap-1 truncate">
                    ✓ Cash in Kitchen
                  </span>
                </div>

                {/* Cash on Delivery (Pending) */}
                <div className="p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-0.5 sm:space-y-1">
                  <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider text-amber-700 block truncate">⏳ COD Pending</span>
                  <div className="text-sm sm:text-2xl font-black text-amber-600 font-heading">
                    ₹{codPendingTotal.toLocaleString()}
                  </div>
                  <span className="text-[8.5px] sm:text-[10px] text-amber-700 font-bold block truncate">
                    Pending Rider Cash
                  </span>
                </div>
              </div>

              {/* 🌟 LUXURY UPI QR SCANNER & GATEWAY STUDIO CARD */}
              <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[32px] bg-white border border-gray-200/90 shadow-soft-card space-y-4">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white flex items-center justify-center shadow-xs shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-base font-black text-gray-900 font-heading">
                        UPI QR Scanner & Online Payment Studio
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-400">Configure your store QR code, UPI ID, GPay / PhonePe / Paytm scanner, and online payment methods</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-black uppercase border ${
                      gatewaySettings.mode === "live"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}>
                      ● {gatewaySettings.mode === "live" ? "Live Gateway" : "Test Sandbox"}
                    </span>

                    <button
                      type="button"
                      disabled={isSavingGateway}
                      onClick={() => handleSaveGatewaySettings()}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-75"
                    >
                      {isSavingGateway ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Save Scanner Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2-Column Responsive Layout: Left = Real Physical QR Standee Mockup, Right = Config Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column (5 Cols): Real-Life Acrylic Merchant Standee Frame */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    
                    {/* Standee Acrylic Frame */}
                    <div className="w-full max-w-[320px] bg-white rounded-3xl border-4 border-amber-300/80 shadow-2xl overflow-hidden relative text-gray-900 flex flex-col items-center">
                      
                      {/* Standee Acrylic Top Handle */}
                      <div className="w-full bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF6B35] py-2.5 px-3 text-white text-center shadow-xs">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm">👑</span>
                          <h5 className="font-black text-xs font-heading tracking-wide uppercase">
                            FoodEat Royal Merchant
                          </h5>
                        </div>
                        <p className="text-[8.5px] text-orange-100 font-bold uppercase tracking-wider">
                          🇮🇳 All-in-One UPI BharatQR
                        </p>
                      </div>

                      {/* Standee Card Body */}
                      <div className="p-4 w-full flex flex-col items-center text-center space-y-2.5 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-[#FFF4E8]">
                        
                        {/* Payee Name & Verified Tick */}
                        <div className="space-y-0.5 w-full">
                          <div className="inline-flex items-center gap-1 text-[11px] font-black text-gray-900 font-heading">
                            <span>{gatewaySettings.payeeName || "FoodEat Royal Kitchen"}</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                          </div>
                          <p className="text-[9px] text-gray-500 font-semibold font-mono truncate px-2">
                            UPI ID: {gatewaySettings.businessUpiId || "foodeat.royal@okhdfcbank"}
                          </p>
                        </div>

                        {/* High-Resolution Standee QR Canvas */}
                        <div className="p-2 bg-white rounded-2xl shadow-md border-2 border-orange-100 relative group">
                          {gatewaySettings.qrCodeImageUrl ? (
                            <img
                              src={gatewaySettings.qrCodeImageUrl}
                              alt="Custom UPI Scanner"
                              className="w-44 h-44 object-contain rounded-xl"
                            />
                          ) : (
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${encodeURIComponent(`upi://pay?pa=${gatewaySettings.businessUpiId || "foodeat.royal@okhdfcbank"}&pn=${encodeURIComponent(gatewaySettings.payeeName || "FoodEat Royal Feast")}&am=${qrTestAmount}&cu=INR&tn=FoodEat_Order`)}`}
                              alt="Dynamic UPI QR Code"
                              className="w-44 h-44 object-contain rounded-xl"
                            />
                          )}

                          {/* Center Crown Watermark */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-orange-200 flex items-center justify-center text-xs pointer-events-none">
                            👑
                          </div>
                        </div>

                        {/* Scan Instruction Banner */}
                        <div className="w-full py-1 px-2 rounded-xl bg-orange-100/70 border border-orange-200/80 text-[9px] font-black text-[#FF6B35] uppercase tracking-wider">
                          Scan & Pay With Any UPI App
                        </div>

                        {/* Official UPI App Icons Footer */}
                        <div className="flex items-center justify-center gap-1.5 flex-wrap text-[8.5px] font-black text-gray-600 pt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200">GPay</span>
                          <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200">PhonePe</span>
                          <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200">Paytm</span>
                          <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200">BHIM</span>
                          <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200">Cred</span>
                        </div>

                      </div>

                      {/* Standee Base / Foot Bar */}
                      <div className="w-full bg-gray-900 py-1.5 px-3 text-center text-gray-300 text-[8.5px] font-bold">
                        🔒 256-Bit NPCI Encrypted Payments
                      </div>

                    </div>

                    {/* Simulation Bill Chips & Print Standee Button */}
                    <div className="w-full max-w-[320px] pt-3 flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1 flex-wrap justify-center">
                        <span className="text-[9px] text-gray-500 font-bold">Bill Preview:</span>
                        {[299, 549, 999, 1499].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setQrTestAmount(amt)}
                            className={`px-2 py-0.5 rounded-md text-[9.5px] font-black transition-all cursor-pointer ${
                              qrTestAmount === amt
                                ? "bg-[#FF6B35] text-white shadow-xs"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>

                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&data=${encodeURIComponent(`upi://pay?pa=${gatewaySettings.businessUpiId || "foodeat.royal@okhdfcbank"}&pn=${encodeURIComponent(gatewaySettings.payeeName || "FoodEat Royal Feast")}&cu=INR&tn=FoodEat_Counter_Order`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-8 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-[10.5px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download High-Res Counter Standee</span>
                      </a>
                    </div>

                  </div>

                  {/* Right Column (7 Cols): Configuration Form & Toggles */}
                  <div className="lg:col-span-7 space-y-3.5">
                    
                    {/* UPI ID & Business Name Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-black text-gray-700 uppercase text-[9px] mb-1 tracking-wider">
                          Business UPI ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9876543210@paytm / foodeat@okhdfcbank"
                          value={gatewaySettings.businessUpiId}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, businessUpiId: e.target.value })}
                          className="w-full h-8 px-2.5 rounded-xl bg-gray-50 border border-gray-200 font-mono font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-gray-700 uppercase text-[9px] mb-1 tracking-wider">
                          Merchant / Payee Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. FoodEat Royal Kitchen"
                          value={gatewaySettings.payeeName}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, payeeName: e.target.value })}
                          className="w-full h-8 px-2.5 rounded-xl bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* Custom QR Code Image Upload & Presets */}
                    <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block font-black text-gray-900 text-xs font-heading">
                            Store&apos;s Physical QR Scanner Standee (Optional)
                          </label>
                          <p className="text-[9.5px] text-gray-500 font-medium">Upload photo of your merchant QR standee (PhonePe, BharatPe, GPay)</p>
                        </div>
                        {gatewaySettings.qrCodeImageUrl && (
                          <button
                            type="button"
                            onClick={() => setGatewaySettings({ ...gatewaySettings, qrCodeImageUrl: "" })}
                            className="text-[9.5px] text-red-500 font-black hover:underline cursor-pointer"
                          >
                            Reset to Dynamic QR
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={qrFileInputRef}
                          accept="image/*"
                          onChange={handleQrImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => qrFileInputRef.current?.click()}
                          className="h-8 px-3 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-gray-800 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all shrink-0"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span>Upload Scanner Photo</span>
                        </button>

                        <input
                          type="text"
                          placeholder="Or paste QR Image URL here..."
                          value={gatewaySettings.qrCodeImageUrl || ""}
                          onChange={(e) => setGatewaySettings({ ...gatewaySettings, qrCodeImageUrl: e.target.value })}
                          className="flex-1 h-8 px-2.5 rounded-xl bg-white border border-gray-200 font-medium text-[11px] text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>

                    {/* Auto-Approve UPI & UTR Toggle */}
                    <div
                      onClick={() => setGatewaySettings({ ...gatewaySettings, autoApproveUpi: !gatewaySettings.autoApproveUpi })}
                      className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-300 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          ⚡
                        </div>
                        <div>
                          <h6 className="font-black text-gray-900 text-xs">Auto-Approve Scanned UPI on Valid UTR</h6>
                          <p className="text-[9.5px] text-gray-500 font-medium">Instantly marks order PAID when customer submits 12-digit UTR</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${
                        gatewaySettings.autoApproveUpi !== false ? "bg-emerald-600" : "bg-gray-300"
                      }`}>
                        {gatewaySettings.autoApproveUpi !== false && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Payment Method Active Toggles (4-Grid) */}
                    <div className="space-y-1">
                      <label className="block font-black text-gray-700 uppercase text-[9px] tracking-wider">
                        Active Payment Channels for Diners
                      </label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {/* 1. UPI QR Scanner */}
                        <div
                          onClick={() => setGatewaySettings({ ...gatewaySettings, isUpiQrEnabled: !gatewaySettings.isUpiQrEnabled })}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            gatewaySettings.isUpiQrEnabled
                              ? "bg-emerald-50/80 border-emerald-300 shadow-2xs"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">📱</span>
                            <div>
                              <h6 className="font-black text-gray-900 text-[11px]">UPI QR Scanner</h6>
                              <p className="text-[8.5px] text-gray-500 font-medium">Scan with any UPI App</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            gatewaySettings.isUpiQrEnabled ? "bg-emerald-600 text-white" : "bg-gray-200"
                          }`}>
                            {gatewaySettings.isUpiQrEnabled && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* 2. Instant Cards & NetBanking */}
                        <div
                          onClick={() => setGatewaySettings({ ...gatewaySettings, isOnlineGatewayEnabled: !gatewaySettings.isOnlineGatewayEnabled })}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            gatewaySettings.isOnlineGatewayEnabled
                              ? "bg-blue-50/80 border-blue-300 shadow-2xs"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">💳</span>
                            <div>
                              <h6 className="font-black text-gray-900 text-[11px]">Cards & NetBanking</h6>
                              <p className="text-[8.5px] text-gray-500 font-medium">Razorpay & Stripe Gateway</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            gatewaySettings.isOnlineGatewayEnabled ? "bg-blue-600 text-white" : "bg-gray-200"
                          }`}>
                            {gatewaySettings.isOnlineGatewayEnabled && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* 3. Cash on Delivery (COD) */}
                        <div
                          onClick={() => setGatewaySettings({ ...gatewaySettings, isCodEnabled: !gatewaySettings.isCodEnabled })}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            gatewaySettings.isCodEnabled
                              ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">💵</span>
                            <div>
                              <h6 className="font-black text-gray-900 text-[11px]">Cash on Delivery</h6>
                              <p className="text-[8.5px] text-gray-500 font-medium">Pay cash upon delivery</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            gatewaySettings.isCodEnabled ? "bg-amber-600 text-white" : "bg-gray-200"
                          }`}>
                            {gatewaySettings.isCodEnabled && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* 4. Card on Delivery */}
                        <div
                          onClick={() => setGatewaySettings({ ...gatewaySettings, isCardOnDeliveryEnabled: !gatewaySettings.isCardOnDeliveryEnabled })}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            gatewaySettings.isCardOnDeliveryEnabled
                              ? "bg-purple-50/80 border-purple-300 shadow-2xs"
                              : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">📟</span>
                            <div>
                              <h6 className="font-black text-gray-900 text-[11px]">Card Machine on Door</h6>
                              <p className="text-[8.5px] text-gray-500 font-medium">Thermal EDC swipe</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            gatewaySettings.isCardOnDeliveryEnabled ? "bg-purple-600 text-white" : "bg-gray-200"
                          }`}>
                            {gatewaySettings.isCardOnDeliveryEnabled && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Scanner Guidance Note */}
                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[9px] mb-1 tracking-wider">
                        Customer Scanner Instructions Note
                      </label>
                      <textarea
                        rows={2}
                        value={gatewaySettings.upiInstructions}
                        onChange={(e) => setGatewaySettings({ ...gatewaySettings, upiInstructions: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 font-medium text-[11px] text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] resize-none"
                      />
                    </div>

                  </div>

                </div>

              </div>

              {/* Transactions Table / List */}
              <div className="p-3 sm:p-6 rounded-2xl sm:rounded-[32px] bg-white border border-gray-200/80 shadow-soft-card space-y-3">
                
                {/* Header & Filter Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-100">
                  <div>
                    <h4 className="text-xs sm:text-base font-black text-gray-900 font-heading">
                      Transaction Ledger & Audit
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400">All order payments, GST tax breakdown, and printable invoices</p>
                  </div>

                  {/* Payment filter pills */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      { label: "All Modes", value: "ALL" },
                      { label: "⚡ Online", value: "ONLINE_PAID" },
                      { label: "💵 COD Paid", value: "COD_PAID" },
                      { label: "⏳ COD Due", value: "COD_PENDING" },
                    ].map((pm) => (
                      <button
                        key={pm.value}
                        onClick={() => setOrderPaymentFilter(pm.value as any)}
                        className={`px-2 py-0.5 rounded-lg text-[9.5px] sm:text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                          orderPaymentFilter === pm.value
                            ? "bg-[#0B1220] text-white shadow-xs"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length > 0 ? (
                  <>
                    {/* MOBILE VIEW: Ultra-Clean Compact Transaction Cards */}
                    <div className="space-y-2 md:hidden">
                      {filteredOrders.map((order) => {
                        const isCod = order.paymentMethod?.toLowerCase().includes("cod") || order.paymentMethod?.toLowerCase().includes("cash");
                        const isCodPaid = isCod && (order.paymentStatus === "PAID" || order.status === "DELIVERED");
                        const isOnlinePaid = !isCod;

                        return (
                          <div
                            key={order.id}
                            className="p-2.5 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-1.5"
                          >
                            {/* Card Top: Order ID, Date & Total Amount */}
                            <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1.5">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-gray-900 font-mono text-[11px]">#{order.id}</span>
                                  {isOnlinePaid ? (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-black text-[8px] uppercase border border-emerald-200">
                                      <Zap className="w-2 h-2 text-emerald-600" />
                                      <span>{order.paymentMethod || "UPI"} • PAID</span>
                                    </span>
                                  ) : isCodPaid ? (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-black text-[8px] uppercase border border-emerald-200">
                                      <CheckCheck className="w-2 h-2 text-emerald-600" />
                                      <span>COD • PAID</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 font-black text-[8px] uppercase border border-amber-300">
                                      <Clock className="w-2 h-2 text-amber-700" />
                                      <span>COD • DUE</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[8.5px] text-gray-400">
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-gray-900 font-heading block">
                                  ₹{Math.round(order.total)}
                                </span>
                                <span className="text-[8px] text-gray-400 block font-medium">
                                  GST ₹{Math.round(order.tax || 0)}
                                </span>
                              </div>
                            </div>

                            {/* Customer & Items */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-gray-800">{order.customerName}</span>
                                <span className="text-gray-400 font-mono text-[9px]">{order.phone}</span>
                              </div>

                              <div className="text-[9.5px] text-gray-600 bg-gray-50/80 p-1.5 rounded-lg font-medium leading-tight line-clamp-2">
                                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                              </div>

                              {order.utrNumber && (
                                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-orange-50/90 border border-orange-200 text-[9.5px]">
                                  <span className="font-bold text-gray-700">📱 UPI Ref / UTR:</span>
                                  <span className="font-mono font-black text-[#FF6B35]">{order.utrNumber}</span>
                                </div>
                              )}
                            </div>

                            {/* Actions Row */}
                            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-gray-100">
                              <button
                                onClick={() => {
                                  downloadOrderReceipt({
                                    orderId: order.id,
                                    customerName: order.customerName,
                                    phone: order.phone,
                                    address: order.address,
                                    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
                                    subtotal: order.subtotal,
                                    discount: order.discount,
                                    shipping: order.deliveryFee,
                                    tax: order.tax,
                                    gstPercent: settings.gstPercent || 5,
                                    total: order.total,
                                    paymentMethod: isCod ? (isCodPaid ? "Cash on Delivery (Paid)" : "Cash on Delivery (Pending)") : order.paymentMethod,
                                    date: new Date(order.createdAt).toLocaleString("en-IN"),
                                  });
                                }}
                                className="flex-1 h-6.5 rounded-lg bg-[#0B1220] hover:bg-black text-white text-[9.5px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Receipt className="w-2.5 h-2.5 text-[#FFC94A]" />
                                <span>Tax Invoice</span>
                              </button>

                              {order.paymentMethod?.toLowerCase().includes("upi") && order.paymentStatus !== "PAID" && (
                                <button
                                  onClick={() => handleVerifyUpiPayment(order.id, order.utrNumber)}
                                  className="h-6.5 px-2 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[9px] flex items-center justify-center gap-0.5 cursor-pointer shadow-2xs"
                                >
                                  <Zap className="w-2.5 h-2.5" />
                                  <span>Verify UPI</span>
                                </button>
                              )}

                              {!isOnlinePaid && !isCodPaid && !order.paymentMethod?.toLowerCase().includes("upi") && (
                                <button
                                  onClick={() => handleApproveCodPayment(order.id)}
                                  className="h-6.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] flex items-center justify-center gap-0.5 cursor-pointer"
                                >
                                  <CheckCheck className="w-2.5 h-2.5" />
                                  <span>Approve</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteTransaction(order.id)}
                                className="h-6.5 px-2 rounded-lg text-red-500 hover:bg-red-50 border border-red-100 flex items-center justify-center cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* DESKTOP VIEW: Full Structured Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-[10px] sm:text-[11px] font-black uppercase text-gray-400 tracking-wider">
                            <th className="py-2.5 px-3">Order / Txn</th>
                            <th className="py-2.5 px-3">Customer</th>
                            <th className="py-2.5 px-3">Items</th>
                            <th className="py-2.5 px-3">Payment</th>
                            <th className="py-2.5 px-3">Subtotal</th>
                            <th className="py-2.5 px-3">GST</th>
                            <th className="py-2.5 px-3">Total</th>
                            <th className="py-2.5 px-3 text-right">Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {filteredOrders.map((order) => {
                            const isCod = order.paymentMethod?.toLowerCase().includes("cod") || order.paymentMethod?.toLowerCase().includes("cash");
                            const isCodPaid = isCod && (order.paymentStatus === "PAID" || order.status === "DELIVERED");
                            const isOnlinePaid = !isCod;

                            return (
                              <tr key={order.id} className="hover:bg-[#FFF8F2]/60 transition-colors">
                                <td className="py-2.5 px-3">
                                  <span className="font-black text-gray-900 font-mono text-[11px]">#{order.id}</span>
                                  <span className="block text-[9px] text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="font-bold text-gray-800 block text-[11px]">{order.customerName}</span>
                                  <span className="text-[9.5px] text-gray-400">{order.phone}</span>
                                </td>
                                <td className="py-2.5 px-3 max-w-[160px]">
                                  <span className="truncate block font-medium text-gray-700 text-[11px]" title={order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}>
                                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  {isOnlinePaid ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase border border-emerald-200">
                                        <Zap className="w-2.5 h-2.5 text-emerald-600" />
                                        <span>{order.paymentMethod || "UPI"} • PAID</span>
                                      </span>
                                      {order.utrNumber && (
                                        <span className="block text-[8.5px] font-mono font-bold text-gray-500">
                                          UTR: {order.utrNumber}
                                        </span>
                                      )}
                                    </div>
                                  ) : isCodPaid ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase border border-emerald-200">
                                      <CheckCheck className="w-2.5 h-2.5 text-emerald-600" />
                                      <span>COD • PAID</span>
                                    </span>
                                  ) : (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[9px] uppercase border border-amber-300">
                                        <Clock className="w-2.5 h-2.5 text-amber-700" />
                                        <span>{order.paymentMethod?.toLowerCase().includes("upi") ? "UPI • UNVERIFIED" : "COD • DUE"}</span>
                                      </span>
                                      {order.utrNumber && (
                                        <span className="block text-[8.5px] font-mono font-bold text-[#FF6B35]">
                                          UTR: {order.utrNumber}
                                        </span>
                                      )}
                                      {order.paymentMethod?.toLowerCase().includes("upi") ? (
                                        <button
                                          onClick={() => handleVerifyUpiPayment(order.id, order.utrNumber)}
                                          className="block px-2 py-0.5 rounded bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[8.5px] cursor-pointer shadow-2xs"
                                        >
                                          ⚡ Verify UPI
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleApproveCodPayment(order.id)}
                                          className="block px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[8.5px] cursor-pointer"
                                        >
                                          ✓ Approve
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-gray-700 text-[11px]">
                                  ₹{Math.round(order.subtotal)}
                                  {order.discount > 0 && (
                                    <span className="block text-[9px] text-emerald-600 font-bold">
                                      -₹{Math.round(order.discount)}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-black text-[#FF6B35] text-[11px]">
                                  +₹{Math.round(order.tax || 0)}
                                  <span className="block text-[8.5px] text-gray-400 font-normal">
                                    ({settings.gstPercent}%)
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="font-black text-xs sm:text-sm text-gray-900 font-heading">
                                    ₹{Math.round(order.total)}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => {
                                        downloadOrderReceipt({
                                          orderId: order.id,
                                          customerName: order.customerName,
                                          phone: order.phone,
                                          address: order.address,
                                          items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
                                          subtotal: order.subtotal,
                                          discount: order.discount,
                                          shipping: order.deliveryFee,
                                          tax: order.tax,
                                          gstPercent: settings.gstPercent || 5,
                                          total: order.total,
                                          paymentMethod: isCod ? (isCodPaid ? "Cash on Delivery (Paid)" : "Cash on Delivery (Pending)") : order.paymentMethod,
                                          date: new Date(order.createdAt).toLocaleString("en-IN"),
                                        });
                                      }}
                                      className="px-2 py-1 rounded-lg bg-[#0B1220] hover:bg-black text-white text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                                      title="Print / Download Official Tax Invoice"
                                    >
                                      <Receipt className="w-3 h-3 text-[#FFC94A]" />
                                      <span className="hidden sm:inline">Receipt</span>
                                    </button>

                                    <button
                                      onClick={() => handleDeleteTransaction(order.id)}
                                      className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete Transaction Record"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-400 text-xs font-bold">
                    No transactions found matching the selected payment filter.
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* TAB: GST & PRICING CONTROLS */}
        {activeTab === "settings" && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header Banner */}
            {!standalone && (
              <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-[#1A1412] via-[#2D1F17] to-[#1A1412] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl border border-white/10">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider">
                    <SlidersHorizontal className="w-3 h-3" /> Master Financial Control
                  </div>
                  <h3 className="text-base sm:text-2xl font-black font-heading">
                    GST Rate & Store Pricing Settings
                  </h3>
                  <p className="text-xs text-gray-300 max-w-xl hidden sm:block">
                    Update GST rate percentage (%) applied to customer orders, configure tax bill labels, FSSAI / GSTIN legal codes, and free delivery thresholds.
                  </p>
                </div>

                <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center self-end sm:self-auto">
                  <span className="text-[9px] text-gray-300 uppercase font-black tracking-wider block">Active GST</span>
                  <span className="text-xl sm:text-2xl font-black text-[#FFC94A] font-heading">{settings.gstPercent}%</span>
                </div>
              </div>
            )}

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="space-y-2.5 sm:space-y-4">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4">
                
                {/* 1. GST & Taxation Configuration */}
                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-200/90 shadow-soft-card space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center font-black text-[11px]">
                        %
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-[11px] sm:text-xs font-heading">GST & Tax Rates</h4>
                        <p className="text-[8.5px] text-gray-400">Configure Tax calculations</p>
                      </div>
                    </div>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <span className="text-[9.5px] font-bold text-gray-700">GST Collection</span>
                      <input
                        type="checkbox"
                        checked={settings.isGstEnabled}
                        onChange={(e) => setSettings({ ...settings, isGstEnabled: e.target.checked })}
                        className="w-3.5 h-3.5 accent-[#FF6B35] rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* GST % Presets */}
                  <div className="space-y-1">
                    <label className="block font-black text-gray-700 uppercase text-[8.5px]">
                      Select GST Rate (%)
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: "Exempt", value: 0 },
                        { label: "Restaurant", value: 5 },
                        { label: "Packaged", value: 12 },
                        { label: "Commercial", value: 18 },
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setSettings({ ...settings, gstPercent: preset.value })}
                          className={`py-1 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                            settings.gstPercent === preset.value
                              ? "bg-[#FFF0E5] border-[#FF6B35] text-[#FF6B35] font-black shadow-2xs"
                              : "bg-gray-50 border-gray-200 text-gray-700 font-bold hover:bg-gray-100"
                          }`}
                        >
                          <span className="block text-xs sm:text-sm font-black font-heading leading-tight">{preset.value}%</span>
                          <span className="text-[7.5px] text-gray-500 block truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom GST Input & Tax Label in 2-Col */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[8.5px] mb-0.5">
                        Custom GST (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="40"
                        step="0.5"
                        required
                        value={settings.gstPercent}
                        onChange={(e) => setSettings({ ...settings, gstPercent: Number(e.target.value) })}
                        className="w-full h-7.5 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[8.5px] mb-0.5">
                        Tax Invoice Label
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="GST (CGST 2.5% + SGST 2.5%)"
                        value={settings.taxName}
                        onChange={(e) => setSettings({ ...settings, taxName: e.target.value })}
                        className="w-full h-7.5 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-[11px]"
                      />
                    </div>
                  </div>

                </div>

                {/* 2. Legal Registration & Delivery Thresholds */}
                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-gray-200/90 shadow-soft-card space-y-2.5">
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-black text-[11px]">
                      🏛️
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-[11px] sm:text-xs font-heading">FSSAI, GSTIN & Delivery</h4>
                      <p className="text-[8.5px] text-gray-400">Legal stamps & delivery threshold</p>
                    </div>
                  </div>

                  {/* Legal Codes (2-Col on Mobile) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[8.5px] mb-0.5">
                        Restaurant GSTIN
                      </label>
                      <input
                        type="text"
                        value={settings.restaurantGstin || "07AABCF1234F1Z8"}
                        onChange={(e) => setSettings({ ...settings, restaurantGstin: e.target.value })}
                        className="w-full h-7.5 px-2 rounded-lg bg-gray-50 border border-gray-200 font-mono font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-[10.5px]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[8.5px] mb-0.5">
                        FSSAI License No.
                      </label>
                      <input
                        type="text"
                        value={settings.fssaiNumber || "10020011005829"}
                        onChange={(e) => setSettings({ ...settings, fssaiNumber: e.target.value })}
                        className="w-full h-7.5 px-2 rounded-lg bg-gray-50 border border-gray-200 font-mono font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-[10.5px]"
                      />
                    </div>
                  </div>

                  {/* Delivery Limits (2-Col on Mobile) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[8.5px] mb-0.5">
                        Free Delivery (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={settings.freeDeliveryThreshold}
                        onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                        className="w-full h-7.5 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-gray-700 uppercase text-[8.5px] mb-0.5">
                        Standard Fee (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={settings.standardDeliveryFee}
                        onChange={(e) => setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })}
                        className="w-full h-7.5 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Live Simulation Preview */}
                  <div className="p-2 rounded-lg bg-orange-50/80 border border-orange-100 text-[10px] space-y-0.5">
                    <span className="font-black text-gray-900 block font-heading">⚡ Live Store Preview:</span>
                    <p className="text-gray-600 text-[9.5px]">
                      ₹500 order: GST = <strong>+₹{Math.round(500 * (settings.gstPercent / 100))}</strong>. Thermal packaging = <strong>FREE</strong>.
                    </p>
                  </div>

                </div>

              </div>

              {/* Submit Save Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#FF7D20] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-xs sm:text-sm shadow-glow transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  {isSavingSettings ? (
                    <span>Saving GST Settings...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Apply GST & Pricing</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        {/* TAB 4: PROMO VOUCHERS & FLASH OFFER BANNER */}
        {activeTab === "promos" && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Header Banner */}
            {!standalone && (
              <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-[#12121A] via-[#241A1E] to-[#12121A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl border border-white/10">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider">
                    <Tag className="w-3 h-3" /> Discount Engine & Flash Banner
                  </div>
                  <h3 className="text-base sm:text-2xl font-black font-heading">
                    Active Dining Vouchers & Flash Offer Banner
                  </h3>
                  <p className="text-xs text-gray-300 max-w-xl hidden sm:block">
                    Create promo codes that automatically power the website&apos;s Flash Offer Banner, or create discount vouchers applied during checkout.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddPromoModal(true)}
                  className="px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create Promo</span>
                </button>
              </div>
            )}

            {/* Live Flash Offer Banner Status Bar */}
            {(() => {
              const activeFlash = promos.find((p) => p.isFlashBanner && p.isActive) || promos.find((p) => p.isActive);
              return (
                <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35]/15 via-[#FF4D6D]/10 to-[#FFC94A]/15 border border-[#FF6B35]/30 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <div className="min-w-0 text-[10.5px] sm:text-xs">
                      <span className="font-black text-gray-900 flex items-center gap-1 truncate">
                        <Flame className="w-2.5 h-2.5 text-[#FF6B35] shrink-0" />
                        <span className="truncate">Flash Banner: <strong>&ldquo;{activeFlash?.code || "NONE"}&rdquo;</strong> {activeFlash ? `(${activeFlash.discountPercent ? `${activeFlash.discountPercent}% OFF` : `₹${activeFlash.fixedDiscount} OFF`})` : ""}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/#offer"
                    target="_blank"
                    className="h-6 px-2 rounded-lg bg-white hover:bg-orange-50 text-[#FF6B35] text-[9.5px] sm:text-[10px] font-black border border-[#FF6B35]/30 shadow-2xs flex items-center gap-1 whitespace-nowrap cursor-pointer shrink-0"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
              );
            })()}

            {/* Vouchers Grid (Compact on Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {promos.map((promo) => {
                const isFlash = promo.isFlashBanner && promo.isActive;

                return (
                  <div
                    key={promo.code}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border transition-all space-y-2 relative overflow-hidden flex flex-col justify-between ${
                      isFlash
                        ? "border-[#FF6B35] ring-1 ring-[#FF6B35]/30 shadow-soft-card"
                        : "border-orange-100/90 shadow-2xs hover:shadow-soft-card"
                    }`}
                  >
                    {/* Decorative Ticket Notches */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8F2] border-r border-orange-200" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFF8F2] border-l border-orange-200" />

                    <div className="space-y-2">
                      {/* Top Row: Monospace Code & Status Toggle */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[11px] tracking-wider font-mono shadow-2xs">
                          {promo.code}
                        </span>

                        <button
                          onClick={() => handleTogglePromo(promo.code, promo.isActive)}
                          className={`px-2 py-0.2 rounded-full text-[8.5px] sm:text-[9px] font-black transition-all cursor-pointer shadow-2xs ${
                            promo.isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {promo.isActive ? "● LIVE" : "○ PAUSED"}
                        </button>
                      </div>

                      {/* Flash Banner Badge / Switch */}
                      <button
                        onClick={() => handleToggleFlashBanner(promo.code, !!promo.isFlashBanner)}
                        className={`w-full py-1 px-2 rounded-lg text-[9px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                          isFlash
                            ? "bg-gradient-to-r from-[#FF6B35] to-[#FF4D6D] text-white border-transparent shadow-2xs"
                            : "bg-orange-50/60 hover:bg-orange-100 text-gray-700 border-orange-200/80"
                        }`}
                      >
                        <Flame className={`w-2.5 h-2.5 ${isFlash ? "text-yellow-200" : "text-[#FF6B35]"}`} />
                        <span className="truncate">{isFlash ? "⭐ Live on Flash Banner" : "Set as Flash Banner"}</span>
                      </button>

                      {/* Discount Value */}
                      <div>
                        <div className="text-base sm:text-lg font-black text-gray-900 font-heading">
                          {promo.discountPercent ? `${promo.discountPercent}% OFF` : `₹${promo.fixedDiscount} FLAT OFF`}
                        </div>
                        <p className="text-[10px] text-gray-600 font-medium leading-snug">
                          {promo.description || "Exclusive Royal Dining Discount Voucher"}
                        </p>
                      </div>

                      {/* Complimentary Gift Item & Min Spend Chips */}
                      <div className="space-y-1">
                        {promo.freeItem && (
                          <div className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200/60 text-[9.5px] font-bold text-emerald-800 flex items-center gap-1">
                            <Gift className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Free Gift: {promo.freeItem}</span>
                          </div>
                        )}

                        <div className="px-2 py-1 rounded-md bg-orange-50/70 border border-orange-100 text-[9.5px] font-bold text-[#FF6B35] flex items-center justify-between">
                          <span>Min Order:</span>
                          <span className="font-black text-gray-900 font-heading">₹{promo.minSpend || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Footer Actions */}
                    <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2 text-xs gap-1.5 mt-1">
                      <button
                        onClick={() => setEditingPromo(promo)}
                        className="flex-1 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-2.5 h-2.5 text-[#FF6B35]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePromo(promo.code)}
                        className="h-7 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-2.5 sm:space-y-3">
            {inquiries.length > 0 ? (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-2.5 sm:p-3.5 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1 min-w-0 flex-1 w-full">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-gray-900 text-[11px] sm:text-xs font-heading">{inq.name}</span>
                        <span className="text-[9px] text-gray-400 font-mono">({inq.email})</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.2 rounded-md bg-orange-100 text-orange-700 font-black">
                        {inq.eventType || "Inquiry"}
                      </span>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-gray-700 bg-gray-50/80 p-2 rounded-lg border border-gray-100 leading-snug">
                      &ldquo;{inq.message}&rdquo;
                    </p>

                    <span className="text-[8.5px] text-gray-400 block">{new Date(inq.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end">
                    <a
                      href={`mailto:${inq.email}?subject=FoodEat Response: ${inq.eventType || "Your Inquiry"}`}
                      className="h-6 px-2.5 rounded-lg bg-[#0B1220] hover:bg-black text-white text-[9.5px] font-black flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-2.5 h-2.5" />
                      <span>Reply</span>
                    </a>
                    <button
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="h-6 px-2 rounded-lg text-red-500 hover:bg-red-50 border border-red-100 transition-colors cursor-pointer flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-2xs text-center space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-800">No Inquiries Yet</h4>
                  <p className="text-[9px] text-gray-400">Messages submitted on the Contact page will appear here.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SUBSCRIBERS */}
        {activeTab === "subscribers" && (
          <div className="space-y-2.5">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF6B35] flex items-center justify-center font-black">
                    <Mail className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-[11px] sm:text-xs font-heading">
                      VIP Newsletter Subscribers ({subscribers.length})
                    </h3>
                    <p className="text-[8px] text-gray-400">Marketing & Promotional Email List</p>
                  </div>
                </div>

                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                  ● Active List
                </span>
              </div>
              
              {subscribers.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {subscribers.map((sub, idx) => {
                    const initial = sub.email ? sub.email.charAt(0).toUpperCase() : "@";
                    return (
                      <div key={idx} className="py-1.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                            {initial}
                          </div>
                          <div className="min-w-0 truncate">
                            <span className="font-bold text-gray-800 text-[10.5px] block truncate">{sub.email}</span>
                            <span className="text-gray-400 text-[8px] block">
                              Joined: {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Active Member"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteSubscriber(sub.email)}
                          className="h-6 px-2 rounded-md bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 text-[9px] font-black transition-colors flex items-center gap-0.5 cursor-pointer shrink-0"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400 text-[10px] space-y-1">
                  <p className="font-bold">No VIP Subscribers Yet</p>
                  <p className="text-[8.5px]">Emails entered in the website footer will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CHEF SPECIAL OF THE MONTH STUDIO */}
        {activeTab === "chefSpecial" && (
          <div className="space-y-3 animate-in fade-in duration-300">
            
            {/* Header Status Bar */}
            {!standalone && (
              <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0E1524] via-[#1B273F] to-[#0E1524] text-white flex items-center justify-between gap-2 border border-white/10 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-white leading-tight font-heading">👑 Chef Special of the Month</p>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${
                        chefSpecial.isActive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {chefSpecial.isActive ? "LIVE" : "DRAFT"}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium truncate">Homepage spotlight hero showcase</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleChefSpecial(!chefSpecial.isActive)}
                  disabled={isSavingChefSpecial}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95 ${
                    chefSpecial.isActive ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{chefSpecial.isActive ? "Live on Store" : "Turn On"}</span>
                </button>
              </div>
            )}

            {/* Main Configuration Form & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
              
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-sm border border-gray-200/90 space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <h4 className="text-[11px] sm:text-xs font-black text-gray-900 font-heading">Dish Settings & Metadata</h4>
                  </div>
                  <span className="text-[8.5px] px-1.5 py-0.2 rounded-full bg-orange-50 text-[#FF6B35] font-bold border border-orange-200/60">
                    Auto-sync Live
                  </span>
                </div>

                <form onSubmit={handleSaveChefSpecial} className="space-y-2 text-xs">
                  
                  {/* Select Dish */}
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">
                      Choose Featured Dish *
                    </label>
                    <select
                      value={chefSpecial.productId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const prod = products.find((p) => p.id === selectedId);
                        if (prod) {
                          setChefSpecial({
                            ...chefSpecial,
                            productId: prod.id,
                            customTitle: prod.name,
                            customDescription: prod.fullDescription || prod.shortDescription,
                            customPrice: prod.price,
                            customImage: prod.images?.[0] || chefSpecial.customImage,
                            buttonText: `Reserve Royal ${prod.name.split(" ")[0]}`,
                          });
                        } else {
                          setChefSpecial({ ...chefSpecial, productId: selectedId });
                        }
                      }}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.category} — {p.name} (₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title & Badge in 2 cols */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Spotlight Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dish Name"
                        value={chefSpecial.customTitle || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, customTitle: e.target.value })}
                        className="w-full h-7.5 px-2 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 text-[10.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Ribbon Badge</label>
                      <input
                        type="text"
                        placeholder="👑 ROYAL SPECIAL"
                        value={chefSpecial.badgeText || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, badgeText: e.target.value })}
                        className="w-full h-7.5 px-2 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 text-[10.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>

                  {/* Description / Story */}
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">
                      Story & Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="An authentic royal culinary masterpiece..."
                      value={chefSpecial.customDescription || ""}
                      onChange={(e) => setChefSpecial({ ...chefSpecial, customDescription: e.target.value })}
                      className="w-full px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 font-medium text-gray-800 text-[10px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35] resize-none leading-relaxed"
                    />
                  </div>

                  {/* 3 Heritage Badges */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Heritage</label>
                      <input
                        type="text"
                        placeholder="Awadh Royals"
                        value={chefSpecial.heritageTag || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, heritageTag: e.target.value })}
                        className="w-full h-7 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 text-[9.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Craft</label>
                      <input
                        type="text"
                        placeholder="4-Hr Dum"
                        value={chefSpecial.slowCookingTag || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, slowCookingTag: e.target.value })}
                        className="w-full h-7 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-[#FF6B35] text-[9.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Batch</label>
                      <input
                        type="text"
                        placeholder="Only 40"
                        value={chefSpecial.dailyBatchTag || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, dailyBatchTag: e.target.value })}
                        className="w-full h-7 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-emerald-600 text-[9.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>

                  {/* Price & Button Text */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Price (₹)</label>
                      <input
                        type="number"
                        placeholder="549"
                        value={chefSpecial.customPrice || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, customPrice: Number(e.target.value) })}
                        className="w-full h-7 px-2 rounded-lg bg-gray-50 border border-gray-200 font-black text-gray-900 text-[10.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-gray-500 uppercase text-[8px] mb-0.5">Button Text</label>
                      <input
                        type="text"
                        placeholder="Reserve Royal Shahi"
                        value={chefSpecial.buttonText || ""}
                        onChange={(e) => setChefSpecial({ ...chefSpecial, buttonText: e.target.value })}
                        className="w-full h-7 px-2 rounded-lg bg-gray-50 border border-gray-200 font-bold text-gray-900 text-[10.5px] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                      />
                    </div>
                  </div>

                  {/* Photo Uploader */}
                  <div className="space-y-1.5 border-t border-gray-100 pt-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-black text-gray-500 uppercase text-[8px]">
                        Photos ({((chefSpecial.customImages && chefSpecial.customImages.length > 0) ? chefSpecial.customImages : (chefSpecial.customImage ? [chefSpecial.customImage] : [])).length}/4)
                      </label>
                      <button
                        type="button"
                        onClick={() => chefSpecialFileInputRef.current?.click()}
                        className="text-[8px] font-black text-[#FF6B35] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2 h-2" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={chefSpecialFileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleChefSpecialImageFileChange}
                      className="hidden"
                    />

                    {/* Image Grid */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {((chefSpecial.customImages && chefSpecial.customImages.length > 0) ? chefSpecial.customImages : (chefSpecial.customImage ? [chefSpecial.customImage] : [])).map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          className={`relative aspect-square rounded-lg overflow-hidden border transition-all group bg-white ${
                            imgIdx === 0 ? "border-[#FF6B35] ring-1 ring-[#FF6B35]/40" : "border-gray-200"
                          }`}
                        >
                          <img src={imgUrl} alt={`Photo ${imgIdx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute top-0.5 left-0.5">
                            {imgIdx === 0
                              ? <span className="px-1 py-0.2 rounded bg-[#FF6B35] text-white text-[7px] font-black">Cover</span>
                              : <span className="px-1 py-0.2 rounded bg-black/60 text-white text-[7px] font-bold">#{imgIdx + 1}</span>
                            }
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 p-0.5">
                            {imgIdx !== 0 && (
                              <button type="button" onClick={() => handleSetPrimaryChefSpecialImage(imgIdx)}
                                className="w-full py-0.2 rounded bg-white text-gray-900 text-[7px] font-black cursor-pointer">Cover</button>
                            )}
                            <button type="button" onClick={() => handleRemoveChefSpecialImage(imgIdx)}
                              className="w-full py-0.2 rounded bg-red-500 text-white text-[7px] font-black cursor-pointer flex items-center justify-center gap-0.5">
                              <Trash2 className="w-2 h-2" /><span>Del</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {((chefSpecial.customImages && chefSpecial.customImages.length > 0) ? chefSpecial.customImages : (chefSpecial.customImage ? [chefSpecial.customImage] : [])).length < 4 && (
                        <button type="button" onClick={() => chefSpecialFileInputRef.current?.click()}
                          className="aspect-square rounded-lg border border-dashed border-[#FF6B35]/40 hover:border-[#FF6B35] bg-orange-50/40 flex flex-col items-center justify-center text-[#FF6B35] cursor-pointer transition-all active:scale-95">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-[7.5px] font-black">+ Add</span>
                        </button>
                      )}
                    </div>

                    {/* Presets Horizontal Scroll */}
                    <div className="flex gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                      {FOOD_PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddPresetChefSpecialImage(img.url)}
                          className="shrink-0 px-1.5 py-0.5 rounded-md bg-gray-100 hover:bg-orange-50 hover:text-[#FF6B35] text-[8px] font-bold transition-all cursor-pointer flex items-center gap-0.5 whitespace-nowrap"
                        >
                          <Plus className="w-1.5 h-1.5" />
                          <span>{img.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* URL paste */}
                    <details className="text-[8px] text-gray-400 cursor-pointer">
                      <summary className="font-bold hover:text-[#FF6B35]">🔗 Paste image URL</summary>
                      <div className="flex gap-1 mt-1">
                        <input
                          type="url"
                          id="customUrlInput"
                          placeholder="https://..."
                          className="flex-1 h-6 px-1.5 rounded-md bg-gray-50 border border-gray-200 text-[9px] font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = (e.currentTarget as HTMLInputElement).value.trim();
                              if (val) {
                                handleAddPresetChefSpecialImage(val);
                                (e.currentTarget as HTMLInputElement).value = "";
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("customUrlInput") as HTMLInputElement;
                            if (input?.value.trim()) {
                              handleAddPresetChefSpecialImage(input.value.trim());
                              input.value = "";
                            }
                          }}
                          className="h-6 px-2 rounded-md bg-gray-900 text-white text-[8px] font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </details>
                  </div>

                  {/* Actions: Save & Publish vs Hide */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSavingChefSpecial}
                      className="flex-1 h-8 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10px] uppercase tracking-wide shadow-glow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSavingChefSpecial ? "Saving..." : "Save & Publish"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleChefSpecial(false)}
                      disabled={isSavingChefSpecial}
                      className="h-8 px-3 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      title="Hide from Homepage"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hide</span>
                    </button>
                  </div>

                </form>
              </div>

              {/* Right Column: Live Card Preview (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black text-gray-700 flex items-center gap-1 font-heading">
                    <Eye className="w-3 h-3 text-[#FF6B35]" />
                    <span>Customer Preview</span>
                  </span>
                  <span className={`text-[7.5px] font-black px-1.5 py-0.2 rounded-full ${
                    chefSpecial.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    {chefSpecial.isActive ? "● Live on Site" : "○ Hidden"}
                  </span>
                </div>

                {/* Compact Preview Card */}
                <div className="rounded-xl bg-white p-2.5 shadow-sm border border-orange-200/50 space-y-2 relative overflow-hidden bg-gradient-to-b from-white to-orange-50/10">
                  
                  {/* Photo Frame with Overlays */}
                  <div className="relative w-full h-28 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={((chefSpecial.customImages && chefSpecial.customImages.length > 0) ? chefSpecial.customImages[0] : (chefSpecial.customImage || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800"))}
                      alt={chefSpecial.customTitle || "Chef Special"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                    
                    {/* Top Ribbon */}
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-amber-300 text-[7.5px] font-black flex items-center gap-0.5 shadow-xs">
                        <span>👑</span>
                        <span className="truncate max-w-[160px]">{chefSpecial.badgeText || "ROYAL CHEF SPECIAL"}</span>
                      </span>
                    </div>

                    {/* Bottom Price Pill */}
                    <div className="absolute bottom-1.5 right-1.5">
                      <span className="px-2 py-0.2 rounded-full bg-[#FF6B35] text-white text-[10px] font-black shadow font-heading">
                        ₹{chefSpecial.customPrice || 549}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h5 className="font-black text-gray-900 text-xs font-heading leading-tight truncate">
                      {chefSpecial.customTitle || "Shahi Awadhi Dum Gosht Biryani"}
                    </h5>
                    <p className="text-[9px] text-gray-500 line-clamp-2 mt-0.5 leading-tight">
                      {chefSpecial.customDescription || "An authentic culinary masterpiece..."}
                    </p>
                  </div>

                  {/* 3 Highlight Badges */}
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-orange-50/80 p-1 rounded-md border border-orange-100">
                      <span className="text-gray-400 block text-[6.5px] uppercase font-bold">Heritage</span>
                      <span className="font-black text-gray-900 text-[8px] truncate block">{chefSpecial.heritageTag || "Awadh"}</span>
                    </div>
                    <div className="bg-orange-50/80 p-1 rounded-md border border-orange-100">
                      <span className="text-gray-400 block text-[6.5px] uppercase font-bold">Craft</span>
                      <span className="font-black text-[#FF6B35] text-[8px] truncate block">{chefSpecial.slowCookingTag || "4-Hr Dum"}</span>
                    </div>
                    <div className="bg-orange-50/80 p-1 rounded-md border border-orange-100">
                      <span className="text-gray-400 block text-[6.5px] uppercase font-bold">Batch</span>
                      <span className="font-black text-emerald-600 text-[8px] truncate block">{chefSpecial.dailyBatchTag || "40 Only"}</span>
                    </div>
                  </div>

                  {/* Button simulation */}
                  <button
                    type="button"
                    onClick={handleSaveChefSpecial}
                    className="w-full h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[10.5px] shadow-glow flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <ChefHat className="w-3 h-3" />
                    <span>{chefSpecial.buttonText || "Reserve"} — ₹{chefSpecial.customPrice || 549}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* ==================== MODAL: ADD NEW DISH ==================== */}
      {mounted && typeof document !== "undefined" && showAddDishModal && createPortal(
        <div 
          onClick={() => setShowAddDishModal(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "72vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Ultra Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 leading-tight">Add Dish</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Quick fill & publish</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddDishModal(false)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body Form Container */}
            <form onSubmit={handleCreateDish} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Double Smash Cheese Burger"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/30 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">Category *</label>
                      <button
                        type="button"
                        onClick={() => setShowInlineAddCategory(!showInlineAddCategory)}
                        className="text-[9px] font-black text-[#FF6B35] hover:underline cursor-pointer"
                      >
                        {showInlineAddCategory ? "Close" : "+ New"}
                      </button>
                    </div>
                    <select
                      value={newDish.category}
                      onChange={(e) => setNewDish({ ...newDish, category: e.target.value as ProductCategory })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>

                    {/* Inline New Category Creator */}
                    {showInlineAddCategory && (
                      <div className="mt-1.5 p-2 rounded-lg bg-amber-50/90 border border-amber-200 space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Category..."
                            value={inlineCategoryName}
                            onChange={(e) => setInlineCategoryName(e.target.value)}
                            className="flex-1 px-2 py-1 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                          />
                          <select
                            value={inlineCategoryEmoji}
                            onChange={(e) => setInlineCategoryEmoji(e.target.value)}
                            className="px-1.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-bold"
                          >
                            {["🍽️","🍔","🍕","🍟","🥢","🍚","🟡","🥥","☕","🍰","🌮","🥗","🍜","🧁","🥘","🍗"].map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setShowInlineAddCategory(false); setInlineCategoryName(""); }}
                            className="flex-1 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-black cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const created = await handleQuickAddCategory();
                              if (created) {
                                setNewDish({ ...newDish, category: created as ProductCategory });
                              }
                            }}
                            className="flex-1 py-1 rounded-md bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-[10px] font-black cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Price (₹ INR) *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      placeholder="199"
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Diet Type</label>
                    <select
                      value={newDish.isVeg ? "veg" : "nonveg"}
                      onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.value === "veg" })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      <option value="veg">🟢 Pure Veg</option>
                      <option value="nonveg">🔴 Non-Veg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Stock</label>
                    <select
                      value={newDish.inStock !== false ? "in_stock" : "out_of_stock"}
                      onChange={(e) => setNewDish({ ...newDish, inStock: e.target.value === "in_stock" })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      <option value="in_stock">🟢 In Stock</option>
                      <option value="out_of_stock">🔴 Sold Out</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Spice Level</label>
                    <select
                      value={newDish.spiceLevel}
                      onChange={(e) => setNewDish({ ...newDish, spiceLevel: Number(e.target.value) as any })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      <option value={1}>🌶️ Mild</option>
                      <option value={2}>🌶️🌶️ Medium</option>
                      <option value={3}>🌶️🌶️🌶️ Hot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Prep (Min)</label>
                    <input
                      type="number"
                      value={newDish.prepTimeMinutes}
                      onChange={(e) => setNewDish({ ...newDish, prepTimeMinutes: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short juicy dish description..."
                    value={newDish.shortDescription}
                    onChange={(e) => setNewDish({ ...newDish, shortDescription: e.target.value })}
                    className="w-full h-12 px-2.5 py-1.5 rounded-lg bg-gray-50/80 border border-gray-200 font-medium text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all resize-none placeholder:text-gray-400"
                  />
                </div>

                {/* Photo Upload & Presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">Dish Photo</label>
                    <span className="text-[9px] text-gray-400 font-medium">Upload or tap preset</span>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-7 px-3 rounded-lg bg-orange-50/80 border border-[#FF6B35]/30 text-[#FF6B35] font-black text-[11px] flex items-center justify-center gap-1.5 hover:bg-orange-100 transition-all cursor-pointer active:scale-98"
                  >
                    <UploadCloud className="w-3 h-3 stroke-[2.5]" />
                    <span>Upload From Phone</span>
                  </button>

                  {/* Preset Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                    {FOOD_PRESET_IMAGES.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setNewDish({ ...newDish, images: preset.url })}
                        className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-orange-100 hover:text-[#FF6B35] text-gray-600 text-[10px] font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {newDish.images && (
                    <div className="relative h-16 rounded-lg overflow-hidden border border-gray-200 mt-1 shadow-inner">
                      <img src={newDish.images} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewDish({ ...newDish, images: "" })}
                        className="absolute top-1 right-1 p-0.5 bg-black/75 text-white rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Compact Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Publish Dish</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: EDIT DISH ==================== */}
      {mounted && typeof document !== "undefined" && editingDish && createPortal(
        <div 
          onClick={() => setEditingDish(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "72vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Ultra Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-black text-gray-900 truncate leading-tight">Edit: {editingDish.name}</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Update dish details</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingDish(null)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body Form Container */}
            <form onSubmit={handleUpdateDish} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDish.name}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">Category *</label>
                      <button
                        type="button"
                        onClick={() => setShowInlineEditAddCategory(!showInlineEditAddCategory)}
                        className="text-[9px] font-black text-[#FF6B35] hover:underline cursor-pointer"
                      >
                        {showInlineEditAddCategory ? "Close" : "+ New"}
                      </button>
                    </div>
                    <select
                      value={editingDish.category}
                      onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value as any })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>

                    {/* Inline New Category Creator */}
                    {showInlineEditAddCategory && (
                      <div className="mt-1.5 p-2 rounded-lg bg-amber-50/90 border border-amber-200 space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Category..."
                            value={inlineCategoryName}
                            onChange={(e) => setInlineCategoryName(e.target.value)}
                            className="flex-1 px-2 py-1 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                          />
                          <select
                            value={inlineCategoryEmoji}
                            onChange={(e) => setInlineCategoryEmoji(e.target.value)}
                            className="px-1.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-bold"
                          >
                            {["🍽️","🍔","🍕","🍟","🥢","🍚","🟡","🥥","☕","🍰","🌮","🥗","🍜","🧁","🥘","🍗"].map((e) => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setShowInlineEditAddCategory(false); setInlineCategoryName(""); }}
                            className="flex-1 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-black cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const created = await handleQuickAddCategory();
                              if (created) {
                                setEditingDish({ ...editingDish, category: created as any });
                              }
                            }}
                            className="flex-1 py-1 rounded-md bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-[10px] font-black cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Price (₹ INR) *</label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={editingDish.price}
                      onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Diet Type</label>
                    <select
                      value={editingDish.isVeg ? "veg" : "nonveg"}
                      onChange={(e) => setEditingDish({ ...editingDish, isVeg: e.target.value === "veg" })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      <option value="veg">🟢 Pure Veg</option>
                      <option value="nonveg">🔴 Non-Veg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Stock</label>
                    <select
                      value={editingDish.inStock !== false ? "in_stock" : "out_of_stock"}
                      onChange={(e) => setEditingDish({ ...editingDish, inStock: e.target.value === "in_stock" })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      <option value="in_stock">🟢 In Stock</option>
                      <option value="out_of_stock">🔴 Sold Out</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Spice Level</label>
                    <select
                      value={editingDish.spiceLevel || 1}
                      onChange={(e) => setEditingDish({ ...editingDish, spiceLevel: Number(e.target.value) as any })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] cursor-pointer"
                    >
                      <option value={1}>🌶️ Mild</option>
                      <option value={2}>🌶️🌶️ Medium</option>
                      <option value={3}>🌶️🌶️🌶️ Hot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Prep (Min)</label>
                    <input
                      type="number"
                      value={editingDish.prepTimeMinutes || 15}
                      onChange={(e) => setEditingDish({ ...editingDish, prepTimeMinutes: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingDish.shortDescription || (editingDish as any).description || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, shortDescription: e.target.value })}
                    className="w-full h-12 px-2.5 py-1.5 rounded-lg bg-gray-50/80 border border-gray-200 font-medium text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] resize-none"
                  />
                </div>

                {/* Photo Upload & Presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">Dish Photo</label>
                    <span className="text-[9px] text-gray-400 font-medium">Upload or tap preset</span>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-7 px-3 rounded-lg bg-orange-50/80 border border-[#FF6B35]/30 text-[#FF6B35] font-black text-[11px] flex items-center justify-center gap-1.5 hover:bg-orange-100 transition-all cursor-pointer active:scale-98"
                  >
                    <UploadCloud className="w-3 h-3 stroke-[2.5]" />
                    <span>Upload From Phone</span>
                  </button>

                  {/* Preset Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                    {FOOD_PRESET_IMAGES.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setEditingDish({ ...editingDish, images: [preset.url] })}
                        className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-orange-100 hover:text-[#FF6B35] text-gray-600 text-[10px] font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {editingDish.images && editingDish.images.length > 0 && (
                    <div className="relative h-16 rounded-lg overflow-hidden border border-gray-200 mt-1 shadow-inner">
                      <img src={editingDish.images[0]} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditingDish({ ...editingDish, images: [] })}
                        className="absolute top-1 right-1 p-0.5 bg-black/75 text-white rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Compact Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: DISH CHOICES & ADD-ONS MANAGER ==================== */}
      {mounted && typeof document !== "undefined" && customizingDish && createPortal(
        <div 
          onClick={() => setCustomizingDish(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[36px] p-4 sm:p-7 shadow-2xl space-y-4 border border-white/80 animate-in zoom-in-95 duration-200 my-auto max-h-[88vh] flex flex-col"
          >
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-gray-100 shrink-0">
                  <img
                    src={customizingDish.images?.[0] || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800"}
                    alt={customizingDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF6B35]/15 text-[#FF6B35]">
                      {customizingDish.category}
                    </span>
                    <span className="text-[10px] font-black text-gray-400">
                      Base Price: ₹{customizingDish.price}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 font-heading leading-tight mt-0.5">
                    {customizingDish.name} • Choices & Add-ons
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Add, update, or delete choices, serving styles, toppings, and add-on upgrades.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCustomizingDish(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smart 1-Click Template Presets */}
            <div className="shrink-0 bg-gradient-to-r from-orange-50/80 to-amber-50/80 p-3.5 rounded-2xl border border-orange-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-gray-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" /> 1-Click Smart Presets (Auto-Fill):
                </span>
                <span className="text-[10px] text-gray-500 font-bold">Quickly customize & adjust prices</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "dessert", label: "🍨 Indian Mithai & Halwa" },
                  { key: "burger", label: "🍔 Burgers & Wraps" },
                  { key: "pizza", label: "🍕 Pizzas & Breads" },
                  { key: "biryani", label: "🍚 Biryani & Thali" },
                  { key: "beverage", label: "☕ Chai & Drinks" },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleApplyPresetTemplate(p.key as any)}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-orange-100/70 border border-orange-200 text-gray-800 text-[10px] font-black flex items-center gap-1 shadow-2xs transition-all cursor-pointer hover:scale-102"
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Groups & Options List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {dishCustomizations.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B35] mx-auto flex items-center justify-center">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-800">No Custom Choices Configured</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                      This dish currently uses default category presets. Click below to add custom groups or use a preset above.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomizationGroup}
                    className="px-4 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-black shadow-md hover:bg-[#E85620] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create 1st Choice Group</span>
                  </button>
                </div>
              ) : (
                dishCustomizations.map((group, groupIdx) => (
                  <div
                    key={group.id}
                    className="p-4 sm:p-5 rounded-3xl bg-gray-50/90 border border-gray-200/90 shadow-2xs space-y-3 transition-all hover:border-gray-300"
                  >
                    {/* Group Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-200">
                      <div className="flex-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white shadow-2xs text-gray-700 text-xs font-black flex items-center justify-center shrink-0 border border-gray-200">
                          {groupIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={group.title}
                          placeholder="e.g. 🍞 Choose Artisan Bun / 🌰 Dry Fruits..."
                          onChange={(e) => handleUpdateGroupTitle(group.id, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Type Selector (Radio vs Checkbox) */}
                        <select
                          value={group.type}
                          onChange={(e) => handleUpdateGroupType(group.id, e.target.value as any)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[11px] font-black text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                        >
                          <option value="single">🔘 Pick 1 (Radio / Required)</option>
                          <option value="multiple">☑️ Multi-Select (Add-ons)</option>
                        </select>

                        {/* Delete Group Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer shrink-0"
                          title="Delete this entire choice group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Options inside this Group */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Group Options ({group.options.length})
                      </span>

                      {group.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-gray-200 shadow-2xs"
                        >
                          {/* Default Selection Flag */}
                          <label className="flex items-center gap-1 text-[10px] font-black text-gray-600 shrink-0 cursor-pointer px-1">
                            <input
                              type={group.type === "single" ? "radio" : "checkbox"}
                              name={`default-opt-${group.id}`}
                              checked={!!opt.isDefault}
                              onChange={(e) => handleUpdateOption(group.id, opt.id, { isDefault: e.target.checked })}
                              className="accent-[#FF6B35] cursor-pointer"
                            />
                            <span className="hidden sm:inline text-[9px]">Default</span>
                          </label>

                          {/* Option Name Input */}
                          <input
                            type="text"
                            value={opt.name}
                            placeholder="Option Name (e.g. Kashmiri Kesar...)"
                            onChange={(e) => handleUpdateOption(group.id, opt.id, { name: e.target.value })}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                          />

                          {/* Extra Price in ₹ */}
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 shrink-0">
                            <span className="text-[11px] font-black text-gray-500">+₹</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={opt.price}
                              onChange={(e) => handleUpdateOption(group.id, opt.id, { price: Number(e.target.value) })}
                              className="w-14 text-xs font-black text-gray-900 bg-transparent focus:outline-none"
                              placeholder="0"
                            />
                          </div>

                          {/* Delete Option */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(group.id, opt.id)}
                            className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                            title="Delete this option"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Option Button */}
                      <button
                        type="button"
                        onClick={() => handleAddOptionToGroup(group.id)}
                        className="w-full py-1.5 px-3 rounded-xl border border-dashed border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50/50 text-[#FF6B35] text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Option to &quot;{group.title || 'Group'}&quot;</span>
                      </button>
                    </div>

                  </div>
                ))
              )}

              {/* Add New Group Button */}
              {dishCustomizations.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddCustomizationGroup}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[#FF6B35]/40 hover:border-[#FF6B35] bg-orange-50/40 hover:bg-orange-50 text-[#FF6B35] text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Another Choice / Add-on Group</span>
                </button>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={handleClearCustomizations}
                disabled={isSavingCustomizations}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCustomizingDish(null)}
                  disabled={isSavingCustomizations}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black text-gray-700 text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomizations}
                  disabled={isSavingCustomizations}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-xs shadow-glow hover:opacity-95 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  {isSavingCustomizations ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Publish Choices</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: ADD FEAST BOX PACK (TIER & %) ==================== */}
      {mounted && typeof document !== "undefined" && showAddFeastBoxModal && createPortal(
        <div 
          onClick={() => setShowAddFeastBoxModal(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "76vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Package className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 leading-tight">Add Feast Box Pack</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Bundle discount tier</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddFeastBoxModal(false)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleCreateFeastBoxTier} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Pack Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shahi Mini Feast (4 Dishes) / Maharaja Royal Box"
                    value={newFeastBoxTier.title}
                    onChange={(e) => setNewFeastBoxTier({ ...newFeastBoxTier, title: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Dish Count *</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      placeholder="4"
                      value={newFeastBoxTier.count}
                      onChange={(e) => setNewFeastBoxTier({ ...newFeastBoxTier, count: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Discount (%) *</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      required
                      placeholder="15"
                      value={newFeastBoxTier.discountPercent}
                      onChange={(e) => setNewFeastBoxTier({ ...newFeastBoxTier, discountPercent: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. MOST POPULAR • 20% OFF / BEST VALUE"
                    value={newFeastBoxTier.badge}
                    onChange={(e) => setNewFeastBoxTier({ ...newFeastBoxTier, badge: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Complimentary Gift Perk</label>
                  <input
                    type="text"
                    placeholder="e.g. Free 24K Gold Gulab Jamun Set"
                    value={newFeastBoxTier.gift}
                    onChange={(e) => setNewFeastBoxTier({ ...newFeastBoxTier, gift: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Compact Live Preview */}
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-gray-900 text-xs truncate">{newFeastBoxTier.title || "Feast Pack Title"}</h4>
                      {newFeastBoxTier.badge && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF6B35] text-white shrink-0">
                          {newFeastBoxTier.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold mt-0.5">
                      {newFeastBoxTier.count || 4} Dishes • <strong className="text-[#FF6B35]">{newFeastBoxTier.discountPercent || 15}% OFF</strong>
                      {newFeastBoxTier.gift ? ` • 🎁 ${newFeastBoxTier.gift}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowAddFeastBoxModal(false)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Save Feast Tier</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: EDIT FEAST BOX PACK (TIER & %) ==================== */}
      {mounted && typeof document !== "undefined" && editingFeastBoxTier && createPortal(
        <div 
          onClick={() => setEditingFeastBoxTier(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "76vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-black text-gray-900 truncate leading-tight">Edit: {editingFeastBoxTier.title}</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Update discount tier</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingFeastBoxTier(null)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleUpdateFeastBoxTier} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Pack Title *</label>
                  <input
                    type="text"
                    required
                    value={editingFeastBoxTier.title}
                    onChange={(e) => setEditingFeastBoxTier((prev) => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Dish Count *</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={editingFeastBoxTier.count}
                      onChange={(e) => setEditingFeastBoxTier((prev) => prev ? { ...prev, count: Number(e.target.value) } : null)}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Discount (%) *</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      required
                      value={editingFeastBoxTier.discountPercent}
                      onChange={(e) => setEditingFeastBoxTier((prev) => prev ? { ...prev, discountPercent: Number(e.target.value) } : null)}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Badge Text</label>
                  <input
                    type="text"
                    value={editingFeastBoxTier.badge || ""}
                    onChange={(e) => setEditingFeastBoxTier((prev) => prev ? { ...prev, badge: e.target.value } : null)}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Complimentary Gift Perk</label>
                  <input
                    type="text"
                    value={editingFeastBoxTier.gift || ""}
                    onChange={(e) => setEditingFeastBoxTier((prev) => prev ? { ...prev, gift: e.target.value } : null)}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Compact Live Preview */}
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-gray-900 text-xs truncate">{editingFeastBoxTier.title}</h4>
                      {editingFeastBoxTier.badge && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF6B35] text-white shrink-0">
                          {editingFeastBoxTier.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold mt-0.5">
                      {editingFeastBoxTier.count} Dishes • <strong className="text-[#FF6B35]">{editingFeastBoxTier.discountPercent}% OFF</strong>
                      {editingFeastBoxTier.gift ? ` • 🎁 ${editingFeastBoxTier.gift}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingFeastBoxTier(null)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3 stroke-[2.5]" />
                  <span>Update Tier</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: ADD / FEATURE DISH IN TRENDING SPOTLIGHT ==================== */}
      {mounted && typeof document !== "undefined" && showAddTrendingModal && createPortal(
        <div 
          onClick={() => {
            setShowAddTrendingModal(false);
            setModalDishSearch("");
            setModalDishCategory("all");
          }}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "80vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF4D6D] to-[#FF6B35] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 leading-tight">Trending Sale Dish</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Feature dish on spotlight</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowAddTrendingModal(false);
                  setModalDishSearch("");
                  setModalDishCategory("all");
                }} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleAddTrendingSpotlight} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-3 space-y-2 bg-white no-scrollbar">
                
                {/* STEP 1: CHOOSE MENU DISH */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">
                      1. Choose Dish ({products.length}) *
                    </label>
                    {newTrending.productId && (
                      <span className="text-emerald-600 font-black flex items-center gap-0.5 text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-2.5 h-2.5" /> Selected
                      </span>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search dish name or category..."
                      value={modalDishSearch}
                      onChange={(e) => setModalDishSearch(e.target.value)}
                      className="w-full h-8 pl-7 pr-2.5 rounded-lg bg-gray-50/80 border border-gray-200 text-xs font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                    {[
                      { id: "all", label: "All" },
                      { id: "Burgers & Wraps", label: "🍔 Burgers" },
                      { id: "Pizzas & Garlic Breads", label: "🍕 Pizzas" },
                      { id: "Snacks & Chaat", label: "🍟 Snacks" },
                      { id: "Chinese & Momos", label: "🥢 Chinese" },
                      { id: "Biryani & North Indian", label: "🍚 Biryani" },
                      { id: "Gujarati & Thalis", label: "🟡 Gujarati" },
                      { id: "Desserts & Shakes", label: "🍰 Desserts" },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setModalDishCategory(cat.id)}
                        className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer text-[10px] ${
                          modalDishCategory === cat.id
                            ? "bg-[#0B1220] text-white font-black"
                            : "bg-gray-100 text-gray-600 hover:bg-orange-50"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Visual Tiles Grid */}
                  <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto pr-0.5 no-scrollbar">
                    {products
                      .filter((p) => {
                        if (modalDishCategory !== "all" && p.category !== modalDishCategory) return false;
                        if (modalDishSearch.trim()) {
                          const q = modalDishSearch.toLowerCase().trim();
                          if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
                        }
                        return true;
                      })
                      .map((p) => {
                        const isSelected = newTrending.productId === p.id;
                        return (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => setNewTrending({ ...newTrending, productId: p.id })}
                            className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-1.5 group relative ${
                              isSelected
                                ? "bg-orange-50 border-[#FF6B35] ring-2 ring-[#FF6B35] shadow-xs"
                                : "bg-gray-50/80 border-gray-200 hover:border-[#FF6B35]/50 hover:bg-white"
                            }`}
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-black text-gray-900 text-[11px] truncate group-hover:text-[#FF6B35]">
                                {p.name}
                              </h5>
                              <span className="text-[10px] font-black text-[#FF6B35] block leading-none mt-0.5">
                                ₹{p.price}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-3.5 h-3.5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center flex-shrink-0">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* STEP 2: CUSTOM OFFER TAG & PRESETS */}
                <div className="space-y-1">
                  <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">
                    2. Offer Tag & Presets *
                  </label>

                  {/* Preset Chips */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      "🔥 FLAT 50% OFF",
                      "🔥 FLAT 20% OFF",
                      "👑 BOGO FREE",
                      "🎁 FREE GULAB JAMUN",
                      "⚡ 25-MIN DISPATCH",
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setNewTrending({ ...newTrending, customOfferTag: preset })}
                        className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold transition-all cursor-pointer ${
                          newTrending.customOfferTag === preset
                            ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF6B35] text-white font-black shadow-xs"
                            : "bg-rose-50/80 hover:bg-rose-100 text-[#FF4D6D] border border-rose-200/80"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Custom Text Input */}
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🔥 TODAY'S SPECIAL: FLAT 50% OFF"
                    value={newTrending.customOfferTag}
                    onChange={(e) => setNewTrending({ ...newTrending, customOfferTag: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                </div>

                {/* STEP 3: BADGE & PRIORITY */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Spotlight Badge</label>
                    <select
                      value={newTrending.offerBadge}
                      onChange={(e) => setNewTrending({ ...newTrending, offerBadge: e.target.value })}
                      className="w-full h-8 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    >
                      <option value="CHEF PICK">👑 CHEF PICK</option>
                      <option value="VIRAL DEAL">🔥 VIRAL DEAL</option>
                      <option value="BESTSELLER">⭐ BESTSELLER</option>
                      <option value="TODAY'S SPECIAL">🎉 TODAY'S SPECIAL</option>
                      <option value="HOT TRENDING">⚡ HOT TRENDING</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Priority (1 = Top)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={newTrending.priority}
                      onChange={(e) => setNewTrending({ ...newTrending, priority: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                {/* STEP 4: LIVE PREVIEW CARD */}
                {newTrending.productId && (
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/80 space-y-1.5">
                    {/* Offer Ribbon */}
                    <div className="w-full bg-gradient-to-r from-[#FF4D6D] via-[#FF6B35] to-[#FF8A00] text-white px-2 py-1 rounded-md text-[10px] font-black uppercase text-center flex items-center justify-center gap-1">
                      <Flame className="w-2.5 h-2.5 fill-white animate-pulse" />
                      <span className="truncate">{newTrending.customOfferTag || "🔥 TODAY'S POPULAR TRENDING DEAL"}</span>
                    </div>

                    {(() => {
                      const selProd = products.find((p) => p.id === newTrending.productId);
                      if (!selProd) return null;
                      return (
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-100">
                          <img
                            src={selProd.images[0]}
                            alt={selProd.name}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-black text-gray-900 text-[11px] truncate">{selProd.name}</h5>
                            <p className="text-[9.5px] text-gray-500 font-bold">
                              <span className="text-[#FF6B35] font-black">₹{selProd.price}</span> • {selProd.category}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTrendingModal(false);
                    setModalDishSearch("");
                    setModalDishCategory("all");
                  }}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTrending.productId || isSubmittingTrending}
                  className={`flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF4D6D] via-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1 ${
                    !newTrending.productId || isSubmittingTrending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmittingTrending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-3 h-3 fill-white" />
                      <span>Publish Deal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: EDIT TRENDING SPOTLIGHT & OFFER ==================== */}
      {mounted && typeof document !== "undefined" && editingTrendingSpotlight && createPortal(
        <div 
          onClick={() => setEditingTrendingSpotlight(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "80vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF4D6D] to-[#FF6B35] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Edit3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 leading-tight">Edit Trending Deal</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Switch dish or update tag</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingTrendingSpotlight(null)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleUpdateTrendingSpotlight} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 pb-3 space-y-2 bg-white no-scrollbar">
                
                {/* STEP 1: CHANGE/CONFIRM DISH */}
                <div className="space-y-1">
                  <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">
                    Featured Dish *
                  </label>

                  {/* Dish Search */}
                  <div className="relative">
                    <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search to switch dish..."
                      value={modalDishSearch}
                      onChange={(e) => setModalDishSearch(e.target.value)}
                      className="w-full h-8 pl-7 pr-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF6B35] transition-all"
                    />
                  </div>

                  {/* Visual Tiles Grid */}
                  <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto pr-0.5 no-scrollbar">
                    {products
                      .filter((p) => {
                        if (modalDishSearch.trim()) {
                          const q = modalDishSearch.toLowerCase().trim();
                          if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
                        }
                        return true;
                      })
                      .map((p) => {
                        const isSelected = editingTrendingSpotlight.productId === p.id;
                        return (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => setEditingTrendingSpotlight((prev) => prev ? { ...prev, productId: p.id } : null)}
                            className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-1.5 group relative ${
                              isSelected
                                ? "bg-orange-50 border-[#FF6B35] ring-2 ring-[#FF6B35] shadow-xs"
                                : "bg-gray-50/80 border-gray-200 hover:border-[#FF6B35]/50 hover:bg-white"
                            }`}
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-black text-gray-900 text-[11px] truncate group-hover:text-[#FF6B35]">
                                {p.name}
                              </h5>
                              <span className="text-[10px] font-black text-[#FF6B35] block leading-none mt-0.5">
                                ₹{p.price}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-3.5 h-3.5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center flex-shrink-0">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* STEP 2: CUSTOM OFFER TAG & PRESETS */}
                <div className="space-y-1">
                  <label className="block font-black text-gray-500 uppercase text-[9px] tracking-wider">
                    Offer Tag & Presets *
                  </label>

                  {/* Preset Chips */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      "🔥 FLAT 50% OFF",
                      "🔥 FLAT 20% OFF",
                      "👑 BOGO FREE",
                      "🎁 FREE GULAB JAMUN",
                      "⚡ 25-MIN DISPATCH",
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setEditingTrendingSpotlight((prev) => prev ? { ...prev, customOfferTag: preset } : null)}
                        className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold transition-all cursor-pointer ${
                          editingTrendingSpotlight.customOfferTag === preset
                            ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF6B35] text-white font-black shadow-xs"
                            : "bg-rose-50/80 hover:bg-rose-100 text-[#FF4D6D] border border-rose-200/80"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Custom Text Input */}
                  <input
                    type="text"
                    required
                    value={editingTrendingSpotlight.customOfferTag || ""}
                    onChange={(e) => setEditingTrendingSpotlight((prev) => prev ? { ...prev, customOfferTag: e.target.value } : null)}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                </div>

                {/* STEP 3: BADGE & PRIORITY */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Spotlight Badge</label>
                    <select
                      value={editingTrendingSpotlight.offerBadge || "CHEF PICK"}
                      onChange={(e) => setEditingTrendingSpotlight((prev) => prev ? { ...prev, offerBadge: e.target.value } : null)}
                      className="w-full h-8 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    >
                      <option value="CHEF PICK">👑 CHEF PICK</option>
                      <option value="VIRAL DEAL">🔥 VIRAL DEAL</option>
                      <option value="BESTSELLER">⭐ BESTSELLER</option>
                      <option value="TODAY'S SPECIAL">🎉 TODAY'S SPECIAL</option>
                      <option value="HOT TRENDING">⚡ HOT TRENDING</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Priority (1 = Top)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={editingTrendingSpotlight.priority || 1}
                      onChange={(e) => setEditingTrendingSpotlight((prev) => prev ? { ...prev, priority: Number(e.target.value) } : null)}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                {/* STEP 4: LIVE PREVIEW CARD */}
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/80 space-y-1.5">
                  {/* Offer Ribbon */}
                  <div className="w-full bg-gradient-to-r from-[#FF4D6D] via-[#FF6B35] to-[#FF8A00] text-white px-2 py-1 rounded-md text-[10px] font-black uppercase text-center flex items-center justify-center gap-1">
                    <Flame className="w-2.5 h-2.5 fill-white animate-pulse" />
                    <span className="truncate">{editingTrendingSpotlight.customOfferTag || "🔥 TODAY'S POPULAR TRENDING DEAL"}</span>
                  </div>

                  {(() => {
                    const selProd = products.find((p) => p.id === editingTrendingSpotlight.productId);
                    if (!selProd) return null;
                    return (
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-100">
                        <img
                          src={selProd.images[0]}
                          alt={selProd.name}
                          className="w-8 h-8 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-black text-gray-900 text-[11px] truncate">{selProd.name}</h5>
                          <p className="text-[9.5px] text-gray-500 font-bold">
                            <span className="text-[#FF6B35] font-black">₹{selProd.price}</span> • {selProd.category}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingTrendingSpotlight(null)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTrending}
                  className={`flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF4D6D] via-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1 ${
                    isSubmittingTrending ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmittingTrending ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3 h-3" />
                      <span>Save Deal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: ADD NEW CATEGORY ==================== */}
      {mounted && typeof document !== "undefined" && showAddCategoryModal && createPortal(
        <div 
          onClick={() => setShowAddCategoryModal(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "76vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FFC94A] to-[#FF8A00] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 leading-tight">Add Category</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">New menu section</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddCategoryModal(false)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleAddCategory} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Biryani / Sizzlers"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Emoji Icon</label>
                    <div className="flex items-center gap-1.5">
                      <span className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-base shrink-0">
                        {newCategory.emoji}
                      </span>
                      <select
                        value={newCategory.emoji}
                        onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                        className="flex-1 h-8 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 cursor-pointer"
                      >
                        {["🍽️","🍔","🍕","🍟","🥢","🍚","🟡","🥥","☕","🍰","🌮","🥗","🍜","🧁","🥘","🍗","🌯","🥙","🧆","🍲","🫕","🥣","🍝","🍛"].map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Subtitle</label>
                    <input
                      type="text"
                      placeholder="Chef Specialty"
                      value={newCategory.subtitle}
                      onChange={(e) => setNewCategory({ ...newCategory, subtitle: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50/80 border border-gray-200 font-bold text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#FF6B35] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-1 tracking-wider">Color Theme</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORY_GRADIENT_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setNewCategory({
                          ...newCategory,
                          bgGradient: preset.bgGradient,
                          borderColor: preset.borderColor,
                          accent: preset.accent,
                        })}
                        className={`h-7 px-2 rounded-lg border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                          newCategory.bgGradient === preset.bgGradient
                            ? "ring-2 ring-[#FF6B35] shadow-xs"
                            : "hover:border-gray-400"
                        } bg-gradient-to-r ${preset.bgGradient} ${preset.borderColor}`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: preset.accent }} />
                        <span className="text-[10px] font-black text-gray-800 truncate">{preset.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Display Priority (1 = Top)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newCategory.priority}
                    onChange={(e) => setNewCategory({ ...newCategory, priority: Number(e.target.value) })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Compact Live Preview */}
                <div className={`p-2 rounded-xl border bg-gradient-to-b ${newCategory.bgGradient || "from-[#FFF0E5] to-[#FFE4D6]"} ${newCategory.borderColor || "border-[#FF6B35]/40"}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white shadow-xs border border-black/5 flex items-center justify-center text-sm shrink-0">
                      {newCategory.emoji}
                    </div>
                    <div className="truncate">
                      <h4 className="font-black text-gray-900 text-xs truncate">{newCategory.name || "Category Name"}</h4>
                      <p className="text-[9px] text-gray-500 font-bold truncate">{newCategory.subtitle || "Chef Specialty"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Publish Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: EDIT CATEGORY ==================== */}
      {mounted && typeof document !== "undefined" && editingCategory && createPortal(
        <div 
          onClick={() => setEditingCategory(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "76vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FFC94A] to-[#FF8A00] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-black text-gray-900 truncate leading-tight">Edit: {editingCategory.name}</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Update category</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingCategory(null)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleUpdateCategory} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Emoji Icon</label>
                    <div className="flex items-center gap-1.5">
                      <span className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-base shrink-0">
                        {editingCategory.emoji}
                      </span>
                      <select
                        value={editingCategory.emoji}
                        onChange={(e) => setEditingCategory({ ...editingCategory, emoji: e.target.value })}
                        className="flex-1 h-8 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 cursor-pointer"
                      >
                        {["🍽️","🍔","🍕","🍟","🥢","🍚","🟡","🥥","☕","🍰","🌮","🥗","🍜","🧁","🥘","🍗","🌯","🥙","🧆","🍲","🫕","🥣","🍝","🍛"].map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Subtitle</label>
                    <input
                      type="text"
                      value={editingCategory.subtitle}
                      onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-1 tracking-wider">Color Theme</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORY_GRADIENT_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setEditingCategory({
                          ...editingCategory,
                          bgGradient: preset.bgGradient,
                          borderColor: preset.borderColor,
                          accent: preset.accent,
                        })}
                        className={`h-7 px-2 rounded-lg border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                          editingCategory.bgGradient === preset.bgGradient
                            ? "ring-2 ring-[#FF6B35] shadow-xs"
                            : "hover:border-gray-400"
                        } bg-gradient-to-r ${preset.bgGradient} ${preset.borderColor}`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: preset.accent }} />
                        <span className="text-[10px] font-black text-gray-800 truncate">{preset.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Priority</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={editingCategory.priority || 1}
                      onChange={(e) => setEditingCategory({ ...editingCategory, priority: Number(e.target.value) })}
                      className="w-full h-8 px-2 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Status</label>
                    <select
                      value={editingCategory.isActive !== false ? "active" : "hidden"}
                      onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.value === "active" })}
                      className="w-full h-8 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 cursor-pointer"
                    >
                      <option value="active">● Live</option>
                      <option value="hidden">○ Hidden</option>
                    </select>
                  </div>
                </div>

                {/* Compact Live Preview */}
                <div className={`p-2 rounded-xl border bg-gradient-to-b ${editingCategory.bgGradient || "from-[#FFF0E5] to-[#FFE4D6]"} ${editingCategory.borderColor || "border-[#FF6B35]/40"}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white shadow-xs border border-black/5 flex items-center justify-center text-sm shrink-0">
                      {editingCategory.emoji}
                    </div>
                    <div className="truncate">
                      <h4 className="font-black text-gray-900 text-xs truncate">{editingCategory.name}</h4>
                      <p className="text-[9px] text-gray-500 font-bold truncate">{editingCategory.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: ADD NEW PROMO VOUCHER & FLASH BANNER ==================== */}
      {mounted && typeof document !== "undefined" && showAddPromoModal && createPortal(
        <div 
          onClick={() => setShowAddPromoModal(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "76vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF4D6D] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 leading-tight">Create Voucher</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Discounts & banners</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddPromoModal(false)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleAddPromo} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                
                {/* Promo Code & Discount */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Voucher Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="ROYAL25"
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase().trim() })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-mono font-black text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35] uppercase tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Discount % *</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      placeholder="25"
                      value={newPromo.discountPercent || ""}
                      onChange={(e) => setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                {/* Min Spend & Duration */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Min Order (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="499"
                      value={newPromo.minSpend}
                      onChange={(e) => setNewPromo({ ...newPromo, minSpend: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Duration (Hrs)</label>
                    <input
                      type="number"
                      min="1"
                      max="72"
                      value={newPromo.hoursLeft}
                      onChange={(e) => setNewPromo({ ...newPromo, hoursLeft: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Description</label>
                  <input
                    type="text"
                    placeholder="25% OFF on Shahi Royal Feast orders"
                    value={newPromo.description}
                    onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Flash Offer Banner Section */}
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPromo.isFlashBanner}
                      onChange={(e) => setNewPromo({ ...newPromo, isFlashBanner: e.target.checked })}
                      className="w-3.5 h-3.5 accent-[#FF6B35] rounded cursor-pointer"
                    />
                    <span className="text-[11px] font-black text-gray-900 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#FF6B35]" />
                      <span>Feature as Flash Banner on Home</span>
                    </span>
                  </label>

                  {newPromo.isFlashBanner && (
                    <div className="space-y-2 pt-1.5 border-t border-orange-200/60">
                      <div>
                        <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">Banner Headline</label>
                        <input
                          type="text"
                          placeholder="Unlock 25% Off + 2 Free Gulab Jamuns"
                          value={newPromo.title}
                          onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                          className="w-full h-7 px-2 rounded-lg bg-white border border-gray-200 font-bold text-gray-900 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">Free Item</label>
                          <input
                            type="text"
                            placeholder="2 Free Gulab Jamuns"
                            value={newPromo.freeItem}
                            onChange={(e) => setNewPromo({ ...newPromo, freeItem: e.target.value })}
                            className="w-full h-7 px-2 rounded-lg bg-white border border-gray-200 font-bold text-gray-900 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">Badge Text</label>
                          <input
                            type="text"
                            placeholder="👑 SHAHI OFFER"
                            value={newPromo.badgeText}
                            onChange={(e) => setNewPromo({ ...newPromo, badgeText: e.target.value })}
                            className="w-full h-7 px-2 rounded-lg bg-white border border-gray-200 font-bold text-gray-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowAddPromoModal(false)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Create Voucher</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL: EDIT PROMO VOUCHER ==================== */}
      {mounted && typeof document !== "undefined" && editingPromo && createPortal(
        <div 
          onClick={() => setEditingPromo(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999999 }}
          className="bg-black/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "380px", maxHeight: "76vh" }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* 1. Header (Compact) */}
            <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF6B35] to-[#FF4D6D] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-black text-gray-900 truncate leading-tight">Edit: {editingPromo.code}</h3>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Update discount & status</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setEditingPromo(null)} 
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <form onSubmit={handleUpdatePromo} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white no-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Voucher Code</label>
                    <input
                      type="text"
                      disabled
                      value={editingPromo.code}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-100 border border-gray-200 font-mono font-black text-gray-500 cursor-not-allowed uppercase text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Discount %</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editingPromo.discountPercent || ""}
                      onChange={(e) => setEditingPromo({ ...editingPromo, discountPercent: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Min Order (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingPromo.minSpend}
                      onChange={(e) => setEditingPromo({ ...editingPromo, minSpend: Number(e.target.value) })}
                      className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Status</label>
                    <select
                      value={editingPromo.isActive ? "active" : "paused"}
                      onChange={(e) => setEditingPromo({ ...editingPromo, isActive: e.target.value === "active" })}
                      className="w-full h-8 px-1.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 cursor-pointer"
                    >
                      <option value="active">● Live Active</option>
                      <option value="paused">○ Paused</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-gray-500 uppercase text-[9px] mb-0.5 tracking-wider">Description</label>
                  <input
                    type="text"
                    value={editingPromo.description}
                    onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-gray-50 border border-gray-200 font-bold text-xs text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Flash Offer Banner Controls */}
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPromo.isFlashBanner}
                      onChange={(e) => setEditingPromo({ ...editingPromo, isFlashBanner: e.target.checked })}
                      className="w-3.5 h-3.5 accent-[#FF6B35] rounded cursor-pointer"
                    />
                    <span className="text-[11px] font-black text-gray-900 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#FF6B35]" />
                      <span>Feature as Flash Banner on Home</span>
                    </span>
                  </label>

                  {editingPromo.isFlashBanner && (
                    <div className="space-y-2 pt-1.5 border-t border-orange-200/60">
                      <div>
                        <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">Banner Headline</label>
                        <input
                          type="text"
                          value={editingPromo.title || ""}
                          onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                          className="w-full h-7 px-2 rounded-lg bg-white border border-gray-200 font-bold text-gray-900 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">Free Item</label>
                          <input
                            type="text"
                            value={editingPromo.freeItem || ""}
                            onChange={(e) => setEditingPromo({ ...editingPromo, freeItem: e.target.value })}
                            className="w-full h-7 px-2 rounded-lg bg-white border border-gray-200 font-bold text-gray-900 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-black text-gray-500 uppercase text-[8.5px] mb-0.5">Badge Text</label>
                          <input
                            type="text"
                            value={editingPromo.badgeText || ""}
                            onChange={(e) => setEditingPromo({ ...editingPromo, badgeText: e.target.value })}
                            className="w-full h-7 px-2 rounded-lg bg-white border border-gray-200 font-bold text-gray-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Pinned Footer */}
              <div className="px-3.5 py-2 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setEditingPromo(null)}
                  className="px-3 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 text-[11px] cursor-pointer active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-7 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white font-black text-[11px] shadow-sm hover:shadow cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3 stroke-[2.5]" />
                  <span>Save Promo</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== FLOATING REAL-TIME NEW ORDER NOTIFICATION TOAST ==================== */}
      {newOrderToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0B1220] text-white p-5 rounded-3xl shadow-2xl border-2 border-[#FF6B35] animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8A00] flex items-center justify-center text-white shadow-glow">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  🔔 New Order Arrived!
                </span>
                <h4 className="text-sm font-black font-heading mt-0.5">
                  Order #{newOrderToast.id}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setNewOrderToast(null)}
              className="p-1 text-gray-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-white/10 text-xs space-y-1">
            <p className="text-gray-300 font-bold truncate">Patron: <span className="text-white">{newOrderToast.customerName}</span></p>
            <p className="text-gray-400 truncate text-[11px]">Items: {newOrderToast.items}</p>
            <div className="flex items-center justify-between pt-1 border-t border-white/10 font-heading">
              <span className="text-gray-300">Amount: <strong className="text-[#FFC94A] text-sm font-black">₹{newOrderToast.total}</strong></span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20 text-white">{newOrderToast.paymentMethod}</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                setActiveTab("orders");
                setNewOrderToast(null);
              }}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-xs font-black text-center shadow-glow cursor-pointer"
            >
              View Ticket ↗
            </button>
            <button
              onClick={() => setNewOrderToast(null)}
              className="px-3 py-2 rounded-xl bg-white/10 text-gray-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL: HOTEL DAY LOCK & SHIFT CLOSING Z-REPORT ==================== */}
      {showDayLockModal && (() => {
        const todayStr = new Date().toISOString().split("T")[0];
        const shiftOrders = orders.filter((o) => {
          if (orderDateFilter === "CUSTOM") {
            return new Date(o.createdAt).toISOString().split("T")[0] === customFilterDate;
          }
          return new Date(o.createdAt).toDateString() === new Date().toDateString();
        });

        const grossSales = shiftOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const gstTax = shiftOrders.reduce((sum, o) => sum + (o.tax || 0), 0);
        const subtotal = shiftOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
        const totalDiscounts = shiftOrders.reduce((sum, o) => sum + (o.discount || 0), 0);

        const onlineSales = shiftOrders
          .filter((o) => !o.paymentMethod?.toLowerCase().includes("cod") && !o.paymentMethod?.toLowerCase().includes("cash"))
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const cashCollected = shiftOrders
          .filter((o) => (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && (o.paymentStatus === "PAID" || o.status === "DELIVERED"))
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const cashPending = shiftOrders
          .filter((o) => (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && o.paymentStatus !== "PAID" && o.status !== "DELIVERED")
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const deliveredCount = shiftOrders.filter((o) => o.status === "DELIVERED").length;
        const activeCount = shiftOrders.filter((o) => o.status !== "DELIVERED").length;

        const handleDownloadShiftZReport = () => {
          downloadDailyShiftClosingReport({
            reportId: `Z-SHIFT-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            totalOrders: shiftOrders.length,
            grossSales,
            totalDiscount: totalDiscounts,
            taxableSales: subtotal,
            gstAmount: gstTax,
            gstPercent: settings.gstPercent || 5,
            deliveryFees: 0,
            onlineUpiPaid: onlineSales,
            cashOnDeliveryCollected: cashCollected,
            cashOnDeliveryPending: cashPending,
            netRevenue: onlineSales + cashCollected,
            orders: shiftOrders.map((o) => ({
              id: o.id,
              customerName: o.customerName,
              paymentMethod: o.paymentMethod || "UPI",
              paymentStatus: (o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")) && o.paymentStatus !== "PAID" && o.status !== "DELIVERED" ? "PENDING" : "PAID",
              total: o.total,
              status: o.status,
              time: new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            })),
          });
          showNotification("🔒 Hotel Daily Shift Closing Receipt (Z-Report) Generated & Downloaded!");
        };

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3"
            onClick={() => setShowDayLockModal(false)}
          >
            <div 
              className="bg-white rounded-2xl max-w-sm w-full p-3.5 space-y-2 shadow-2xl border border-gray-100 animate-in fade-in-50 zoom-in-95 duration-150 relative"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#0B1220] flex items-center justify-center text-[#FFC94A] shrink-0">
                    <LockKeyhole className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[11.5px] sm:text-xs font-black text-gray-900 font-heading leading-tight">
                      Hotel Day Lock & Shift Closing
                    </h3>
                    <p className="text-[7.5px] sm:text-[8.5px] text-gray-400 leading-none">
                      Audit transactions & download Official Z-Report
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDayLockModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Shift Audit Summary Cards (4-Col Row) */}
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="py-1 px-0.5 rounded-lg bg-gray-50 border border-gray-200/80">
                  <span className="text-[7px] font-black uppercase text-gray-400 block truncate">Orders</span>
                  <span className="text-[11px] sm:text-xs font-black text-gray-900 font-heading leading-tight">{shiftOrders.length}</span>
                </div>
                <div className="py-1 px-0.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-[7px] font-black uppercase text-emerald-800 block truncate">Delivered</span>
                  <span className="text-[11px] sm:text-xs font-black text-emerald-700 font-heading leading-tight">{deliveredCount}</span>
                </div>
                <div className="py-1 px-0.5 rounded-lg bg-orange-50 border border-orange-200">
                  <span className="text-[7px] font-black uppercase text-[#FF6B35] block truncate">Kitchen</span>
                  <span className="text-[11px] sm:text-xs font-black text-[#FF6B35] font-heading leading-tight">{activeCount}</span>
                </div>
                <div className="py-1 px-0.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-[7px] font-black uppercase text-amber-800 block truncate">GST Tax</span>
                  <span className="text-[11px] sm:text-xs font-black text-amber-700 font-heading leading-tight">₹{Math.round(gstTax)}</span>
                </div>
              </div>

              {/* Financial Channels Breakdown Box */}
              <div className="p-2 rounded-xl bg-[#0B1220] text-white space-y-1.5 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="text-[8.5px] font-black uppercase text-gray-300 tracking-wider">Gross Shift Revenue</span>
                  <span className="text-xs sm:text-sm font-black text-[#FFC94A] font-heading">₹{grossSales.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="py-1 px-0.5 rounded-md bg-white/10 space-y-0.5">
                    <span className="text-[6.5px] text-gray-300 font-bold uppercase block truncate">⚡ UPI Online</span>
                    <span className="text-[10px] sm:text-[10.5px] font-black text-emerald-400 block leading-tight">₹{onlineSales.toLocaleString()}</span>
                  </div>
                  <div className="py-1 px-0.5 rounded-md bg-white/10 space-y-0.5">
                    <span className="text-[6.5px] text-gray-300 font-bold uppercase block truncate">💵 COD Cash</span>
                    <span className="text-[10px] sm:text-[10.5px] font-black text-emerald-400 block leading-tight">₹{cashCollected.toLocaleString()}</span>
                  </div>
                  <div className="py-1 px-0.5 rounded-md bg-white/10 space-y-0.5">
                    <span className="text-[6.5px] text-gray-300 font-bold uppercase block truncate">⏳ COD Due</span>
                    <span className="text-[10px] sm:text-[10.5px] font-black text-amber-400 block leading-tight">₹{cashPending.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowDayLockModal(false)}
                  className="h-7 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-[9.5px] text-gray-700 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleDownloadShiftZReport}
                  className="flex-1 h-7 px-2.5 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] hover:from-[#E85620] hover:to-[#E67E00] text-white font-black text-[9.5px] shadow-glow transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 truncate"
                >
                  <Printer className="w-3 h-3 shrink-0" />
                  <span className="truncate">🔒 Lock Day & Download Z-Report</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ==================== MODAL: 7-DAY RECEIPT ARCHIVE & RECOVERY ==================== */}
      {showReceiptArchiveModal && (
        <div 
          onClick={() => setShowReceiptArchiveModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-[36px] max-w-4xl w-full p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-2xl border border-gray-100 animate-in fade-in-50 zoom-in-95 duration-200 max-h-[88vh] flex flex-col"
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3ECF6E]/20 to-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32]">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 font-heading">
                    7-Day Receipt Permanent Archive & Tax Invoices
                  </h3>
                  <p className="text-xs text-gray-400">
                    Even if an order is deleted from the active kitchen queue, all receipts from the last 7 days are safely preserved here for reprint.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptArchiveModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Search archive by Order #, Customer Name, Phone..."
                value={archiveSearchQuery}
                onChange={(e) => setArchiveSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Archive List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {isFetchingArchive ? (
                <div className="p-12 text-center text-gray-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#FF6B35] mx-auto mb-2" />
                  <span>Loading 7-day receipt archive...</span>
                </div>
              ) : (() => {
                const filteredArchive = archiveReceipts.filter((t) => {
                  const q = archiveSearchQuery.toLowerCase();
                  return (
                    t.orderId.toLowerCase().includes(q) ||
                    t.customerName.toLowerCase().includes(q) ||
                    (t.phone && t.phone.toLowerCase().includes(q))
                  );
                });

                if (filteredArchive.length === 0) {
                  return (
                    <div className="p-12 text-center text-gray-400 text-xs font-bold">
                      No archive receipts found in the last 7 days.
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                    {filteredArchive.map((t) => (
                      <div key={t.id} className="p-4 bg-white hover:bg-orange-50/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-gray-900">#{t.orderId}</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                              {t.paymentMethod}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              t.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {t.paymentStatus === "PAID" ? "✓ PAID" : "⏳ PENDING"}
                            </span>
                          </div>
                          <p className="text-gray-800 font-bold">{t.customerName} • <span className="text-gray-500">{t.phone}</span></p>
                          <p className="text-[11px] text-gray-400">
                            {new Date(t.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {t.itemsSummary && ` • Items: ${t.itemsSummary}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="text-xs text-gray-400 block">Total Paid</span>
                            <span className="text-base font-black text-gray-900 font-heading">₹{Math.round(t.totalAmount)}</span>
                          </div>

                          <button
                            onClick={() => handleDownloadTransactionInvoice(t)}
                            className="px-3.5 py-2 rounded-xl bg-[#0B1220] hover:bg-black text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                            title="Reprint Official GST Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#FFC94A]" />
                            <span>Reprint Receipt</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowReceiptArchiveModal(false)}
                className="py-2.5 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black text-xs text-gray-700 cursor-pointer"
              >
                Close Archive
              </button>
            </div>

          </div>
        </div>
      )}



      {/* ==================== MODAL: COMPLETE ORDER DETAILS & PATRON HISTORY ==================== */}
      {selectedOrderDetails && (() => {
        const order = selectedOrderDetails;
        const isCod = order.paymentMethod?.toLowerCase().includes("cod") || order.paymentMethod?.toLowerCase().includes("cash");
        const isCodPaid = isCod && (order.paymentStatus === "PAID" || order.status === "DELIVERED");
        const isOnlinePaid = !isCod;

        // Patron lifetime order stats ("kitne order kare hain")
        const patronAllOrders = orders.filter(
          o => (order.phone && o.phone === order.phone) ||
               (order.customerName && o.customerName.toLowerCase() === order.customerName.toLowerCase())
        );
        const patronTotalSpent = patronAllOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 animate-in fade-in duration-200">
            <div className="bg-white w-full sm:max-w-md max-h-[92vh] sm:max-h-[88vh] rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
              
              {/* Mobile Top Drag Indicator */}
              <div className="pt-2 pb-0.5 sm:hidden flex justify-center shrink-0">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              {/* Clean Horizontal Header */}
              <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 flex items-center justify-between gap-2 shrink-0 bg-white">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="px-2 py-0.5 rounded-lg bg-[#FF6B35] text-white font-black text-[11px] shrink-0 shadow-2xs">
                    #{order.id.slice(-4)}
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 font-heading tracking-tight truncate">
                        Order #{order.id}
                      </h3>
                      {isOnlinePaid ? (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                          ⚡ UPI Paid
                        </span>
                      ) : isCodPaid ? (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                          ✓ COD Paid
                        </span>
                      ) : (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200 animate-pulse shrink-0">
                          ⏳ COD Due
                        </span>
                      )}
                    </div>
                    <p className="text-[9.5px] text-gray-400 flex items-center gap-1 mt-0.2">
                      <Clock className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                      <span className="truncate">{new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 flex-1 no-scrollbar bg-[#F8F9FA]">
                
                {/* PATRON & DELIVERY DETAILS CARD */}
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-2">
                  {/* Row 1: Name + Lifetime Orders Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-xs shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-gray-400 block leading-none">Customer Profile</span>
                        <h4 className="font-black text-gray-900 text-xs truncate leading-tight font-heading mt-0.5">{order.customerName}</h4>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B35] border border-orange-200/80 inline-flex items-center gap-1 shadow-2xs">
                        <span>👑 {patronAllOrders.length} {patronAllOrders.length === 1 ? "Order" : "Orders"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Phone & Quick Contact Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[11px] text-gray-800 font-bold min-w-0">
                      <Phone className="w-3 h-3 text-[#FF6B35] shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`tel:${order.phone}`}
                        className="px-2 py-0.5 rounded-lg bg-gray-50 hover:bg-emerald-50 text-emerald-700 text-[10px] font-black border border-gray-200 shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <PhoneCall className="w-2.5 h-2.5 text-[#3ECF6E]" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10px] font-black shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Row 3: Full Delivery Address */}
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-150 text-[10.5px] text-gray-700 flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 text-[#FF6B35] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-gray-900 block text-[9.5px] uppercase tracking-wider">Delivery Address:</span>
                      <p className="text-[10.5px] text-gray-600 leading-snug">{order.address}</p>
                    </div>
                  </div>
                </div>

                {/* ORDERED DISHES LIST */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-[9.5px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <UtensilsCrossed className="w-3 h-3 text-[#FF6B35]" />
                      <span>Items Ordered ({order.items?.length || 0})</span>
                    </span>
                    <span className="text-[9.5px] font-bold text-gray-400">
                      {order.items?.reduce((sum, i) => sum + i.quantity, 0)} Total Units
                    </span>
                  </div>

                  <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar pr-0.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white border border-gray-200/80 shadow-2xs flex items-center justify-between gap-2 hover:border-orange-300 transition-all">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-150 shrink-0 shadow-2xs"
                          />
                          <div className="overflow-hidden min-w-0">
                            <span className="font-black text-gray-900 text-[11px] block truncate leading-tight font-heading">
                              {item.name}
                            </span>
                            <span className="text-[9.5px] text-gray-500 font-bold block mt-0.2">
                              ₹{item.price} × {item.quantity} Unit{item.quantity > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-black text-xs text-gray-900 font-heading block">
                            ₹{Math.round(item.price * item.quantity)}
                          </span>
                          <span className="text-[8.5px] font-black text-[#FF6B35] px-1.5 py-0.2 rounded bg-orange-50 border border-orange-200 block mt-0.2">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINANCIAL BILL BREAKDOWN */}
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1 text-xs">
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-gray-400 block mb-0.5">Bill Breakdown</span>
                  <div className="flex justify-between text-gray-600 text-[10.5px]">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900">₹{Math.round(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 text-[10.5px]">
                      <span>Coupon Discount</span>
                      <span className="font-bold">-₹{Math.round(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 text-[10.5px]">
                    <span>Delivery Charges</span>
                    <span className="font-bold text-emerald-600">
                      {order.deliveryFee && order.deliveryFee > 0 ? `₹${order.deliveryFee}` : "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-[10.5px]">
                    <span>GST (CGST + SGST {settings.gstPercent}%)</span>
                    <span className="font-bold text-gray-900">+₹{Math.round(order.tax || 0)}</span>
                  </div>
                  <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center text-xs font-black text-gray-900">
                    <span>Grand Total Bill:</span>
                    <span className="text-sm sm:text-base text-[#FF6B35] font-heading font-black">₹{order.total}</span>
                  </div>
                </div>

                {/* LIVE KITCHEN ADVANCER PIPELINE */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#FF6B35]" /> Advance Cooking Stage:
                    </span>
                    <span className="text-[8px] font-black uppercase text-[#FF6B35] px-1.5 py-0.2 rounded-md bg-orange-50 border border-orange-200">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="p-1 rounded-xl bg-gray-100 grid grid-cols-5 gap-1">
                    {[
                      { label: "1. Received", status: "ORDER_RECEIVED" as OrderStatus },
                      { label: "2. Prep", status: "CHEF_PREPARING" as OrderStatus },
                      { label: "3. Baking", status: "WOOD_FIRED_BAKING" as OrderStatus },
                      { label: "4. Bike", status: "COURIER_DISPATCHED" as OrderStatus },
                      { label: "5. Done", status: "DELIVERED" as OrderStatus },
                    ].map((st) => (
                      <button
                        key={st.status}
                        onClick={() => {
                          handleUpdateOrderStatus(order.id, st.status);
                          setSelectedOrderDetails({ ...order, status: st.status });
                        }}
                        className={`py-1.5 text-center rounded-lg text-[8px] sm:text-[9px] font-black transition-all cursor-pointer ${
                          order.status === st.status
                            ? "bg-[#3ECF6E] text-white shadow-2xs font-black scale-102"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Sticky Footer Actions */}
              <div className="p-2.5 sm:p-3 bg-white border-t border-gray-200 flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    downloadOrderReceipt({
                      orderId: order.id,
                      customerName: order.customerName,
                      phone: order.phone,
                      address: order.address,
                      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
                      subtotal: order.subtotal,
                      discount: order.discount,
                      shipping: order.deliveryFee,
                      tax: order.tax,
                      gstPercent: settings.gstPercent || 5,
                      total: order.total,
                      paymentMethod: isCod ? (isCodPaid ? "Cash on Delivery (Paid)" : "Cash on Delivery (Pending)") : order.paymentMethod,
                      date: new Date(order.createdAt).toLocaleString("en-IN"),
                    });
                  }}
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-orange-50 text-gray-800 text-[11px] font-black border border-gray-200 shadow-2xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                >
                  <Printer className="w-3 h-3 text-[#FF6B35]" />
                  <span>Receipt</span>
                </button>

                <Link
                  href={`/track/${order.id}`}
                  target="_blank"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A00] text-white text-[11px] font-black shadow-glow flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                >
                  <Bike className="w-3 h-3" />
                  <span>Live Radar</span>
                </Link>

                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="py-2 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-black cursor-pointer active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </main>
  );
}
