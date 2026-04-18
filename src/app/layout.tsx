import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Next.js E-Commerce",
  description: "Production grade e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
