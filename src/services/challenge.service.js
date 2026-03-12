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

export const getAllChallenges = async () => {
  const res = await api.get("/challenge");
  return res.data;
};

export const getLeaderboard = async (challengeId) => {
  const res = await api.get(`/challenge/leaderboard/${challengeId}`);

  return res.data;
};
export const exitChallenge = async (challengeId) => {
  const res = await api.delete("/challenge/exit", {
    data: { challenge_id: challengeId },
  });

  return res.data;
};

export const deleteChallenge = async (challengeId) => {
  const res = await api.delete(`/challenge/${challengeId}`);

  return res.data;
};
