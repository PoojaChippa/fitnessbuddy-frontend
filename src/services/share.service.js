import api from "./api";

export const shareProgress = async (data) => {
  const res = await api.post("/share", data);
  return res.data;
};

export const getMyFeed = async () => {
  const res = await api.get("/share/my");
  return res.data;
};
