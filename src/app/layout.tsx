import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shoply — Style For Every Moment',
  description: 'Discover the latest trends in fashion, electronics, home essentials and more — all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#F8F6F1] text-[#171717] antialiased">
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
