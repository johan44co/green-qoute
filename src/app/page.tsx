import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Get instant solar panel installation quotes for your home. Calculate costs, energy savings, and ROI with our smart calculator.",
};

export default async function Home() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col justify-between lg:grid lg:grid-cols-2 min-h-screen">
        {/* Logo - Top on mobile, top left on desktop */}
        <div className="lg:hidden py-8 px-4">
          <span className="text-2xl font-semibold">Green Quote</span>
        </div>

        {/* Content */}
        <div className="relative container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 xl:py-32 flex items-center lg:min-h-screen">
          {/* Logo - Desktop only, top left */}
          <div className="hidden lg:block lg:absolute lg:top-8 lg:left-8">
            <span className="text-2xl font-semibold">Green Quote</span>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Get instant solar panel quotes for your home
            </h1>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              Calculate your solar panel installation costs, energy savings, and return on investment in seconds. 
              Green Quote makes it easy to understand your solar options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <>
                  <Link 
                    href="/quotes/add"
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-11 px-8 text-base bg-foreground text-background hover:bg-foreground/90"
                  >
                    Get a Quote
                  </Link>
                  <Link 
                    href="/quotes"
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-11 px-8 text-base border border-foreground/20 bg-transparent hover:bg-foreground/10"
                  >
                    View My Quotes
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/sign-up"
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-11 px-8 text-base bg-foreground text-background hover:bg-foreground/90"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/sign-in"
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-11 px-8 text-base border border-foreground/20 bg-transparent hover:bg-foreground/10"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Image - Shows at bottom on mobile */}
        <div className="relative h-64 lg:hidden">
          <Image
            src="/home.jpg"
            alt="Solar panel installation"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Desktop Image - Shows on right side on desktop */}
        <div className="relative hidden lg:block">
          <Image
            src="/home.jpg"
            alt="Solar panel installation"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
    </div>
  );
}
