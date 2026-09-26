import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RENZA | On-Demand Household Help',
  description:
    'Book trained and verified household helpers whenever you need them. RENZA makes everyday household help simple, flexible and convenient.',
  keywords: [
    'household help',
    'maid service',
    'on-demand cleaning',
    'house cleaning',
    'book a maid',
    'RENZA',
    'household helper',
  ],
  openGraph: {
    title: 'RENZA | On-Demand Household Help',
    description:
      'Book trained and verified household helpers whenever you need them. RENZA makes everyday household help simple, flexible and convenient.',
    type: 'website',
    siteName: 'RENZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RENZA | On-Demand Household Help',
    description:
      'Book trained and verified household helpers whenever you need them.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
