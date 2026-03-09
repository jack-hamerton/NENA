"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen pb-16 lg:pb-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 mx-auto w-full max-w-screen-xl">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
