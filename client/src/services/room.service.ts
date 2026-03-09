import api from "@/lib/api";
import { Room, Participant } from "@/types";

export const roomService = {
  getRooms: async () => {
    const response = await api.get<Room[]>("/rooms");
    return response.data;
  },

  getRoom: async (roomId: string) => {
    const response = await api.get<Room>(`/rooms/${roomId}`);
    return response.data;
  },

  joinRoom: async (roomId: string) => {
    const response = await api.post<Participant>(`/rooms/${roomId}/join`);
    return response.data;
  },

  leaveRoom: async (roomId: string) => {
    await api.post(`/rooms/${roomId}/leave`);
  },
};
