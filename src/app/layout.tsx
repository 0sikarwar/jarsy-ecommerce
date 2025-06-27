import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/hooks/use-cart';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Sole Central',
  description: 'The one-stop shop for the best shoes on the web.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <CartProvider>
            <Header />
            <div className="flex-grow">
                {children}
            </div>
            <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
