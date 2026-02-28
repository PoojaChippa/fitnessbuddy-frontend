import api from "./api";

export const sendMessage = async (data) => {
  const res = await api.post("/message", data);
  return res.data;
};

export const getConversation = async (userId) => {
  const res = await api.get(`/message/${userId}`);
  return res.data;
};
