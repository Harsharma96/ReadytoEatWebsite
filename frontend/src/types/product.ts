export interface NutritionFacts {
  calories: number;
  protein: string;
  carbs: string;
  sugar: string;
  fat: string;
  fiber: string;
  vitaminC?: string;
  potassium?: string;
  iron?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  type: "single" | "multiple";
  required?: boolean;
  options: CustomizationOption[];
}

export type ProductCategory = 
  | "Burgers & Wraps"
  | "Pizzas & Garlic Breads"
  | "Snacks & Chaat"
  | "Chinese & Momos"
  | "Biryani & North Indian"
  | "Gujarati & Thalis"
  | "South Indian"
  | "Chai, Coffee & Juices"
  | "Desserts & Shakes"
  | "Royal North Indian"
  | "Indo-Chinese"
  | "Gujarati Special"
  | "Street Food & Chaat"
  | "Pizzas & Continental"
  | "Shahi Desserts"
  | "Beverages & Chai"
  | "Royal Biryani"
  | "Tandoor & Kebabs"
  | "Desi Curries & Dal"
  | "Artisanal Breads"
  | "Traditional Drinks";

export type ProductDietary = 
  | "Pure Veg"
  | "Non-Veg"
  | "Jain Friendly"
  | "Halal Certified"
  | "Gluten-Free"
  | "Desi Ghee Special"
  | "Chef Special"
  | "High Protein"
  | "Organic";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  cuisine?: string;
  isVeg?: boolean;
  accentColor: string;
  gradientBg: string;
  badge: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  dietary: ProductDietary[];
  nutrition: NutritionFacts;
  ingredients: string[];
  benefits: string[];
  servingSuggestion: string;
  storage: string;
  images: string[];
  spiceLevel?: 1 | 2 | 3;
  prepTimeMinutes?: number;
  budgetTier?: "under_199" | "under_299" | "under_399" | "premium";
  customizations?: CustomizationGroup[];
  floatingAssets?: {
    mainIngredient: string;
    secondaryIngredient: string;
    splashEmoji?: string;
  };
  featured: boolean;
  isNew: boolean;
  bestSeller?: boolean;
  inStock: boolean;
  netWeight: string;
  reviewsList?: Review[];
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "time" | "calories-asc";
