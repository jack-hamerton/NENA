import api from "@/lib/api";
import { CalendarEvent, EventCreate } from "@/types/calendar";

export const calendarService = {
  getEvents: async () => {
    const response = await api.get<CalendarEvent[]>("/calendar/events");
    return response.data;
  },

  createEvent: async (data: EventCreate) => {
    const response = await api.post<CalendarEvent>("/calendar/", data);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<EventCreate>) => {
    const response = await api.put<CalendarEvent>(`/calendar/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    await api.delete(`/calendar/${id}`);
  },

  respondToInvitation: async (id: string, response: "accept" | "decline") => {
    await api.put(`/calendar/invitations/${id}`, null, { params: { response } });
  },
};
