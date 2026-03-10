import { AppShell } from "@/components/layout/AppShell";
import { NotificationProvider } from "@/context/NotificationContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <AppShell>{children}</AppShell>
    </NotificationProvider>
  );
}
