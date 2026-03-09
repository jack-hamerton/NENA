import api from "@/lib/api";
import { User, LoginInput, SignupInput } from "@/types";

export const authService = {
  login: async (data: LoginInput) => {
    const response = await api.post<{ user: User; token: string }>("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupInput) => {
    const response = await api.post<{ user: User; token: string }>("/auth/signup", data);
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async () => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};
