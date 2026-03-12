import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { AuthInit } from '@/components/AuthInit';

export const metadata: Metadata = {
  title: 'Smart Salon & Parlour Management System',
  description: 'Book your salon appointments online with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <AuthInit />
          {children}
        </Providers>
      </body>
    </html>
  );
}
