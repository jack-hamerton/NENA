export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: "meeting" | "podcast" | "study" | "room";
  creatorId: string;
}
