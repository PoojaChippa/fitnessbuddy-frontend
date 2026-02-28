import api from "./api";

export const createChallenge = async (data) => {
  const res = await api.post("/challenge", data);
  return res.data;
};

export const joinChallenge = async (data) => {
  const res = await api.post("/challenge/join", data);
  return res.data;
};

export const logChallengeProgress = async (data) => {
  const res = await api.post("/challenge/log", data);
  return res.data;
};

export const getMyChallenges = async () => {
  const res = await api.get("/challenge/my");
  return res.data;
};

export const getChallengeProgress = async (challengeId) => {
  const res = await api.get(`/challenge/${challengeId}`);
  return res.data;
};
