import api from "./api";

/* SHARE PROGRESS */
export const shareProgress = async (payload) => {
  const res = await api.post("/share", payload);
  return res.data.data;
};

/* GET FEED */
export const getMyFeed = async () => {
  const res = await api.get("/share/my");
  return res.data.data;
};
