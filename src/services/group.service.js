import api from "./api";

/*  CREATE GROUP */
export const createGroup = async (payload) => {
  const res = await api.post("/group", payload);
  return res.data.data; // single group object
};

/* LOG WORKOUT */
export const logGroupWorkout = async (groupId, payload) => {
  const res = await api.post("/group/workout", {
    groupId,
    ...payload,
  });

  return res.data.data;
};
/* JOIN GROUP */
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

/* DELETE GROUP */
export const deleteGroup = async (groupId) => {
  const res = await api.delete(`/group/${groupId}`);
  return res.data;
};

export const checkGroupMembership = async (groupId) => {
  const res = await api.get(`/group/${groupId}/is-member`);
  return res.data.data; // boolean
};
export const leaveGroup = async (groupId) => {
  const res = await api.delete(`/group/${groupId}/leave`);
  return res.data;
};

export const getGroupMembers = async (groupId) => {
  const res = await api.get(`/group/${groupId}/members`);
  return res.data.data;
};
