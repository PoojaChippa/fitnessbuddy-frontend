import api from "./api";

export const createGroup = async (data) => {
  const res = await api.post("/group", data);
  return res.data;
};

export const joinGroup = async (data) => {
  const res = await api.post("/group/join", data);
  return res.data;
};

export const logGroupWorkout = async (data) => {
  const res = await api.post("/group/workout", data);
  return res.data;
};

export const getMyGroups = async () => {
  const res = await api.get("/group/my");
  return res.data;
};

export const getGroupStats = async (groupId) => {
  const res = await api.get(`/group/${groupId}/stats`);
  return res.data;
};

export const getGroupProgress = async (groupId) => {
  const res = await api.get(`/group/${groupId}/progress`);
  return res.data;
};

export const getGroupLeaderboard = async (groupId) => {
  const res = await api.get(`/group/${groupId}/leaderboard`);
  return res.data;
};
