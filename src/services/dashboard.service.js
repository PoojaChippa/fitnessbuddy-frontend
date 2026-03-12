import api from "./api";

export const getDashboard = async () => {
  const [workoutStatsRes, userAnalyticsRes, workoutAnalyticsRes] =
    await Promise.all([
      api.get("/workout/stats"),
      api.get("/user/analytics"),
      api.get("/workout/analytics"),
    ]);

  return {
    ...workoutStatsRes.data.data,
    ...userAnalyticsRes.data.data,
    ...workoutAnalyticsRes.data.data,
  };
};
