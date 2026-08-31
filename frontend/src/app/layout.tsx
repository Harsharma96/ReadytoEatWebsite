import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Toast } from "@/components/Toast";
import { CustomCursor } from "@/components/CustomCursor";
import { Preloader } from "@/components/Preloader";
import { FloatingParticles } from "@/components/FloatingParticles";
import { LiquidBlobSystem } from "@/components/LiquidBlobSystem";

export const metadata: Metadata = {
  title: "FoodEat™ | Royal Indian Culinary Heritage & Shahi Rasoi",
  description: "Authentic Awadhi Dum Biryanis, 24-hr slow-simmered Dal Makhani, clay-tandoor kebabs, and golden desserts cooked in 100% pure cow desi ghee.",
  keywords: "food delivery, royal indian food, awadhi biryani, butter chicken, dal makhani, paneer tikka, foodeat, shahi rasoi, pure desi ghee",
  openGraph: {
    title: "FoodEat™ | Shahi Taste. Royal Heritage. Delivered Hot.",
    description: "Award-winning authentic Indian royal culinary delivery platform with live GPS radar tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-[#FF6B35] selection:text-white bg-[#FFF8F2] relative">
        <AuthProvider>
          <CartProvider>
            <Preloader />
            <CustomCursor />
            <FloatingParticles />
            <LiquidBlobSystem />
            {children}
            <CartDrawer />
            <QuickViewModal />
            <CheckoutModal />
            <Toast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
