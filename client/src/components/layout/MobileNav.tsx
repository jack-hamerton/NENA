"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageSquare, Radio, Headphones, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const mobileItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Discover", href: "/discover", icon: Search },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Rooms", href: "/rooms", icon: Radio },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Custom profile link if user is logged in
  const items = mobileItems.map(item => 
    item.label === "Profile" && user 
      ? { ...item, href: `/profile/${user.username}` } 
      : item
  );

  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t bg-background/90 p-1 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
