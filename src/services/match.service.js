import api from "./api";

export const getMatches = async () => {
  const res = await api.get("/match");

  return res.data;
};
