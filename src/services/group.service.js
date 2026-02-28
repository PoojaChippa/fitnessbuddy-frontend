import api from "./api";

/* =========================
   CREATE GROUP
========================= */
export const createGroup = async (payload) => {
  const res = await api.post("/group", payload);
  return res.data.data; // single group object
};

/* =========================
   JOIN GROUP
========================= */
export const joinGroup = async (groupId) => {
  const res = await api.post("/group/join", { groupId });
  return res.data.data;
};

/* =========================
   GET MY GROUPS
========================= */
export const getMyGroups = async () => {
  const res = await api.get("/group/my");

  // CONFIRMED: data is ARRAY
  return res.data.data;
};

/* =========================
   GET GROUP PROGRESS
========================= */
export const getGroupProgress = async (groupId) => {
  const res = await api.get(`/group/${groupId}/progress`);
  return res.data.data; // object
};

/* GET GROUP STATS */
export const getGroupStats = async (groupId) => {
  const res = await api.get(`/group/${groupId}/stats`);
  return res.data.data; // array
};

/* GET LEADERBOARD */
export const getGroupLeaderboard = async (groupId) => {
  const res = await api.get(`/group/${groupId}/leaderboard`);
  return res.data.data; // array (camelCase keys)
};
