import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/context";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "NENA | Empowerment & Connectivity",
  description: "A community-focused platform for visual artists, designers, and creatives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary/30 selection:text-primary">
        <AppProviders>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AppProviders>
      </body>
    </html>
  );
}
