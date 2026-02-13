export function Footer() {
  return (
    <footer className="border-t border-foreground/20 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Brand */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Green Quote</h3>
            <p className="text-sm text-foreground/70">
              Get instant solar panel quotes for your home.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-sm text-foreground/70">
            © {new Date().getFullYear()} Green Quote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
