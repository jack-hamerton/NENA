import { NotificationList } from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="text-xs font-medium text-primary hover:underline">Mark all as read</button>
      </div>
      <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
        <NotificationList />
      </div>
    </div>
  );
}
