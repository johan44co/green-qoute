"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
} from "@/components/ui";

interface HeaderProps {
  user: {
    name: string;
    email: string;
    role?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch {
      // Silent failure - user will be redirected
    } finally {
      setIsSigningOut(false);
    }
  };

  const isAdmin = user.role?.includes("admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/20 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg"
            >
              Green Quote
            </Link>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-foreground/70">{user.email}</span>
            </div>

            <MenuRoot>
              <MenuTrigger
                openOnHover
                aria-label="User menu"
                className="h-9 w-9 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center font-semibold text-sm transition-colors cursor-pointer"
              >
                {user.name.charAt(0).toUpperCase()}
              </MenuTrigger>
              <MenuPortal>
                <MenuPositioner side="bottom" align="end">
                  <MenuPopup>
                    {/* User info on mobile */}
                    <div className="md:hidden px-2 py-2 border-b border-foreground/20 mb-1">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-foreground/70">
                        {user.email}
                      </div>
                    </div>

                    {/* Navigation items */}
                    <MenuItem>
                      <Link href="/quotes" className="flex-1">
                        My Quotes
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link href="/quotes/add" className="flex-1">
                        New Quote
                      </Link>
                    </MenuItem>

                    {isAdmin && (
                      <>
                        <MenuSeparator />
                        <MenuGroup>
                          <MenuGroupLabel>Admin</MenuGroupLabel>
                          <MenuItem>
                            <Link href="/admin/quotes" className="flex-1">
                              All Quotes
                            </Link>
                          </MenuItem>
                        </MenuGroup>
                      </>
                    )}

                    <MenuSeparator />

                    <MenuItem onClick={handleSignOut} disabled={isSigningOut}>
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </MenuItem>
                  </MenuPopup>
                </MenuPositioner>
              </MenuPortal>
            </MenuRoot>
          </div>
        </div>
      </div>
    </header>
  );
}
