import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelwave-studio.vercel.app"),
  title: "PixelWave Studio - Retro CRT Image Effects",
  description:
    "Transform images into mesmerizing animated patterns using vintage dithering algorithms. Create retro CRT effects, ASCII art, and animated dither patterns.",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📺</text></svg>",
  },
  openGraph: {
    title: "PixelWave Studio - Retro CRT Image Effects",
    description:
      "Transform images into mesmerizing animated patterns using vintage dithering algorithms",
    url: "https://pixelwave-studio.vercel.app",
    siteName: "PixelWave Studio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PixelWave Studio - Retro CRT Image Effects",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelWave Studio - Retro CRT Image Effects",
    description:
      "Transform images into mesmerizing animated patterns using vintage dithering algorithms",
    images: ["/og-image.png"],
    creator: "@blakssh",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📺</text></svg>"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
