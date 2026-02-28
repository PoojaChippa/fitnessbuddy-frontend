import api from "./api";

export const getNearbyGyms = async () => {
  const res = await api.get("/gym");
  return res.data;
};
