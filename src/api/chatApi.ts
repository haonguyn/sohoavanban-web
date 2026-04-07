import api from "./axios";

export const sendChatMessage = async (formData: FormData) => {
  return await api.post("/chat/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000, // 60s timeout for LLM
  });
};

export const closeConversation = async (conversationId: number) => {
  return await api.post("/chat/close/", { conversation_id: conversationId });
};
