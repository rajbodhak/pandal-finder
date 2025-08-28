import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '@/context/AuthContext';
import Providers from '@/components/providers/ThemeProvider';
import { Footer } from '@/components/Layout/Footer';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Google Analytics ID 
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Viewport configuration (separate from metadata in Next.js 14+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Enhanced metadata with comprehensive SEO
export const metadata: Metadata = {
  // Basic Meta Tags
  title: {
    template: '%s | DuggaKhoj - Kolkata Durga Puja Guide',
    default: 'DuggaKhoj - Durga Puja Pandal Guide & Route Planner Kolkata 2025'
  },
  description: 'Discover the best Durga Puja pandals in Kolkata with custom route planning. Find pandals in North, South & Central Kolkata with GPS directions, timings, and crowd updates.',
  keywords: [
    'durga puja kolkata',
    'pandal hopping',
    'kolkata pandals 2025',
    'durga puja route planner',
    'best pandals kolkata',
    'pandal finder',
    'north kolkata pandals',
    'south kolkata pandals',
    'central kolkata pandals',
    'durga puja guide',
    'কলকাতা দুর্গা পূজা',
    'পান্ডেল হপিং'
  ],
  authors: [{ name: 'DuggaKhoj Team' }],
  creator: 'DuggaKhoj',
  publisher: 'DuggaKhoj',

  // Site Configuration
  metadataBase: new URL('https://duggakhoj.site'),
  alternates: {
    canonical: 'https://duggakhoj.site',
  },

  // Icons - ADDED FOR LOGO SUPPORT
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: '/logo-512.png',
    shortcut: '/favicon.ico'
  },
  // Open Graph (Facebook, WhatsApp, etc.)
  openGraph: {
    title: 'DuggaKhoj - Your Ultimate Durga Puja Pandal Guide',
    description: 'Discover and navigate top Durga Puja pandals of Kolkata with GPS routing, live tracking, custom filters and interactive map integration',
    url: 'https://duggakhoj.site',
    siteName: 'DuggaKhoj',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DuggaKhoj - Durga Puja Pandal Guide Kolkata',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'DuggaKhoj - Durga Puja Pandal Route Planner',
    description: 'Find & plan routes to the best Durga Puja pandals in Kolkata. GPS-enabled pandal hopping made easy!',
    images: ['/twitter-image.jpg'], // You'll need to add this image to /public/
    // creator: '@duggakhoj', // Add when you create social media accounts
  },

  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // App-specific
  applicationName: 'DuggaKhoj',
  referrer: 'origin-when-cross-origin',
  category: 'travel',

  // Verification codes (add these when you set up accounts)
  // verification: {
  //   google: 'your-google-search-console-verification-code',
  // },
};

// UPDATED Structured Data for better SEO with Logo
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DuggaKhoj',
  alternateName: 'Dugga Khoj',
  description: 'Durga Puja Pandal Guide and Route Planner for Kolkata',
  url: 'https://duggakhoj.site',
  // ADDED LOGO FOR GOOGLE SEARCH RESULTS
  logo: {
    '@type': 'ImageObject',
    url: 'https://duggakhoj.site/logo-512.png',
    width: 512,
    height: 512
  },
  // ADDED WEBSITE AS A SEPARATE ENTITY
  sameAs: [
    // Add your social media URLs when you create them
    // 'https://www.facebook.com/duggakhoj',
    // 'https://twitter.com/duggakhoj',
    'https://www.instagram.com/duggakhoj'
  ]
};

// ADDITIONAL Structured Data for Website functionality
const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DuggaKhoj',
  url: 'https://duggakhoj.site',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://duggakhoj.site/?search={search_term_string}',
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@id': 'https://duggakhoj.site/#organization'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="tA0gNJuJuMRRAgGliGsC_jSo4GvcB7XrNlY7wybl_9I" />

        {/* Organization Structured Data for Logo */}
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Website Structured Data for Search Functionality */}
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />

        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${baloo2.variable} antialiased bg-white dark:bg-gray-900 text-gray-100 transition-colors`}>
        <Providers>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              {/* Main content area that grows to fill available space */}
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}