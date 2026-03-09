"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  MessageSquare, 
  Radio, 
  Headphones, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Settings,
  Bell,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Discover", href: "/discover", icon: Search },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Rooms", href: "/rooms", icon: Radio },
  { label: "Podcasts", href: "/podcasts", icon: Headphones },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Study Room", href: "/study", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Dynamic profile link if user is logged in
  const items = navItems.map(item =>
    item.label === "Profile" && user
      ? { ...item, href: `/profile/${user.username}` }
      : item
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar p-4 lg:block hidden">
      <div className="flex h-full flex-col">
        <div className="mb-8 flex items-center px-2">
          <Link href="/home" className="text-xl font-bold text-primary">
            NENA
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-sidebar-border pt-4">
          <Link
            href="/notifications"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/notifications"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
            )}
          >
            <Bell className="h-5 w-5" /> Notifications
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
