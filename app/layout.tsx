import type { Metadata } from 'next';
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bondor Bati - Chittagong Heritage Cuisine | Daily Tiffin & Event Catering',
  description:
    'Order authentic Chittagong heritage meals from Bondor Bati. Daily tiffin service and event catering delivered to your door.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-white text-gray-900 antialiased selection:bg-red-100 selection:text-red-900">
        {children}
      </body>
    </html>
  );
}
