import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NEXUS AI — AI Agents as Your Employees',
  description: 'Enterprise-grade AI agents that work like real employees. Automate any business process.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCProvider>
        <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
          suppressHydrationWarning
        >
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta name="theme-color" content="#08090A" />
          </head>
          <body className="bg-bg-primary text-text-primary min-h-full flex flex-col">
            {children}
          </body>
        </html>
      </TRPCProvider>
    </ClerkProvider>
  );
}
