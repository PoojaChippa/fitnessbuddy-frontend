import api from "./api";

export const getMatches = async () => {
  const res = await api.get("/matches");
  return res.data;
};
