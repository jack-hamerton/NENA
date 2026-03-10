import api from "@/lib/api";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  episodeId: string;
  question: string;
  options: PollOption[];
  createdAt: string;
}

export const pollService = {
  getPolls: async (episodeId: string) => {
    const response = await api.get<Poll[]>(`/polls/episode/${episodeId}`);
    return response.data;
  },

  voteOnPoll: async (pollId: string, optionId: string) => {
    const response = await api.post(`/polls/${pollId}/vote/${optionId}`);
    return response.data;
  },
};
