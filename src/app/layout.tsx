import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Green Quote - Solar Panel Installation Quotes",
    template: "%s | Green Quote",
  },
  description:
    "Get instant solar panel installation quotes for your home. Calculate costs, energy savings, and return on investment with accurate location-based pricing.",
  keywords: [
    "solar panels",
    "solar installation",
    "solar quote",
    "renewable energy",
    "solar calculator",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {session && (
          <Header
            user={{
              name: session.user.name,
              email: session.user.email,
              role: session.user.role,
            }}
          />
        )}
        <div className="root flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
