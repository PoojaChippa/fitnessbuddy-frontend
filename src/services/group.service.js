import api from "./api";

/* =========================
   CREATE GROUP
========================= */

export const createGroup = async (payload) => {
  const res = await api.post("/group", payload);
  return res.data.data;
};

/* =========================
   JOIN GROUP
========================= */

export const joinGroup = async (groupId) => {
  const res = await api.post("/group/join", {
    group_id: groupId, // must match backend
  });

  return res.data.data;
};

/* =========================
   LEAVE GROUP
========================= */

export const leaveGroup = async (groupId) => {
  const res = await api.delete(`/group/${groupId}/leave`);
  return res.data;
};

/* =========================
   DELETE GROUP
========================= */

export const deleteGroup = async (groupId) => {
  const res = await api.delete(`/group/${groupId}`);
  return res.data;
};

/* =========================
   GET MY GROUPS
========================= */

export const getMyGroups = async () => {
  const res = await api.get("/group/my");
  return res.data.data;
};

/* =========================
   CHECK MEMBERSHIP
========================= */

export const checkGroupMembership = async (groupId) => {
  const res = await api.get(`/group/${groupId}/is-member`);
  return res.data.data; // boolean
};

/* =========================
   LOG GROUP WORKOUT
========================= */

export const logGroupWorkout = async (groupId, payload) => {
  const res = await api.post("/group/workout", {
    group_id: groupId,
    type: payload.type,
    duration: payload.duration,
    calories: payload.calories,
  });

  return res.data.data;
};
/* =========================
   GET GROUP PROGRESS
========================= */

export const getGroupProgress = async (groupId) => {
  const res = await api.get(`/group/${groupId}/progress`);
  return res.data.data;
};

/* =========================
   GET GROUP DAILY STATS
========================= */

export const getGroupStats = async (groupId) => {
  const res = await api.get(`/group/${groupId}/stats`);
  return res.data.data;
};

/* =========================
   GET GROUP LEADERBOARD
========================= */

export const getGroupLeaderboard = async (groupId) => {
  const res = await api.get(`/group/${groupId}/leaderboard`);
  return res.data.data;
};

/* =========================
   GET GROUP MEMBERS
========================= */

export const getGroupMembers = async (groupId) => {
  const res = await api.get(`/group/${groupId}/members`);
  return res.data.data;
};
