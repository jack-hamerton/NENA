import api from "@/lib/api";

export const aiService = {
  rewriteText: async (text: string, tone: string) => {
    try {
      const response = await api.post<{ rewrittenText: string }>("/ai/rewrite", {
        text,
        tone,
      });
      return response.data.rewrittenText;
    } catch (error) {
      console.error("Error rewriting text:", error);
      throw error;
    }
  },

  chatWithAI: async (messages: any[]) => {
    const response = await api.post("/ai/chat", { messages });
    return response.data;
  },
};
