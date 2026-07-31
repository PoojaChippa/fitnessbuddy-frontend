import api from "./api";

export const getDashboard = async () => {
  const timestamp = Date.now();
  const [workoutStatsRes, userAnalyticsRes, workoutAnalyticsRes] =
    await Promise.all([
      api.get(`/workout/stats?t=${timestamp}`),
      api.get(`/user/analytics?t=${timestamp}`),
      api.get(`/workout/analytics?t=${timestamp}`),
    ]);

  return {
    ...workoutStatsRes.data.data,
    ...userAnalyticsRes.data.data,
    ...workoutAnalyticsRes.data.data,
  };
};
