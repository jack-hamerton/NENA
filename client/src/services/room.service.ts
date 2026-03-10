import api from "@/lib/api";
import { Room, Participant, CreateRoomInput } from "@/types/room";

export const roomService = {
  getRooms: async () => {
    const response = await api.get<Room[]>("/rooms");
    return response.data;
  },

  getRoomById: async (roomId: string) => {
    const response = await api.get<Room>(`/rooms/${roomId}`);
    return response.data;
  },

  createRoom: async (data: CreateRoomInput) => {
    const response = await api.post<Room>("/rooms", data);
    return response.data;
  },

  getParticipants: async (roomId: string) => {
    const response = await api.get<Participant[]>(`/rooms/${roomId}/participants`);
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
