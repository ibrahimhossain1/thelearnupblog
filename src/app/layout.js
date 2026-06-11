import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import LayoutWrapper from "./components/LayoutWrapper";
import AdSense from "./components/AdSense";
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  let siteConfig = null;
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (projectId && projectId !== 'your-project-id') {
      siteConfig = await client.fetch(`*[_type == "siteConfig"][0]`);
    }
  } catch (err) {
    console.warn('Metadata fetch failed:', err.message);
  }

  const title = siteConfig?.siteName || "The Learn Up";
  const tagline = siteConfig?.tagline || "Premium Insights & Creative Stories";
  const desc = "A premium blog platform showcasing articles, coding tutorials, lifestyle, and design insights.";

  // Resolve dynamic favicon url from siteConfig
  let faviconUrl = '/favicon.ico';
  if (siteConfig?.logoImage?.asset?._ref && !siteConfig.logoImage.asset._ref.startsWith('mock')) {
    try {
      faviconUrl = urlForImage(siteConfig.logoImage).width(32).height(32).url();
    } catch (err) {
      console.warn('Failed to parse favicon:', err.message);
    }
  }

  return {
    title: {
      default: `${title} | ${tagline}`,
      template: `%s | ${title}`
    },
    description: desc,
    icons: {
      icon: faviconUrl,
    },
    keywords: ["Next.js", "Sanity CMS", "Vercel", "Web Development", "Design", "AdSense Blog"],
    authors: [{ name: "The Learn Up Team" }],
    creator: "The Learn Up Team",
    openGraph: {
      title: title,
      description: desc,
      url: "https://your-domain.com",
      siteName: title,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }) {
  let siteConfig = null;
  let adsenseConfig = null;
  let socialConfig = null;
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (projectId && projectId !== 'your-project-id') {
      // Fetch in parallel using Promise.all to prevent sequential request waterfalls
      [siteConfig, adsenseConfig, socialConfig] = await Promise.all([
        client.fetch(`*[_type == "siteConfig"][0]`),
        client.fetch(`*[_type == "adsenseConfig"][0]`),
        client.fetch(`*[_type == "socialMedia"][0]`)
      ]);
    }
  } catch (err) {
    console.warn('Layout siteConfig fetch failed:', err.message);
  }

  const primaryColor = siteConfig?.primaryColor || 'indigo';
  const themeColorMap = {
    indigo: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      accent: '#a855f7',
      accentHover: '#9333ea',
    },
    blue: {
      primary: '#2271b1',
      primaryHover: '#135e96',
      accent: '#38bdf8',
      accentHover: '#0ea5e9',
    },
    violet: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      accent: '#ec4899',
      accentHover: '#db2777',
    },
    rose: {
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      accent: '#fb7185',
      accentHover: '#f43f5e',
    },
    emerald: {
      primary: '#10b981',
      primaryHover: '#059669',
      accent: '#3b82f6',
      accentHover: '#2563eb',
    },
  };

  const selectedColor = themeColorMap[primaryColor] || themeColorMap.indigo;
  const adsenseClientId = adsenseConfig?.enableAds ? (adsenseConfig?.adSensePublisherId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT) : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <AdSense client={adsenseClientId} />
      </head>
      <body 
        style={{
          '--wp-primary-color': selectedColor.primary,
          '--wp-primary-color-hover': selectedColor.primaryHover,
          '--wp-accent-color': selectedColor.accent,
          '--wp-accent-color-hover': selectedColor.accentHover,
        }}
        className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300"
      >
        <ThemeProvider>
          <LayoutWrapper siteConfig={siteConfig} socialConfig={socialConfig}>
            {children}
          </LayoutWrapper>
          <ScrollToTop />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

