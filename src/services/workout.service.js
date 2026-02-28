import api from "./api";

/* Add Workout */
export const addWorkout = async (payload) => {
  const res = await api.post("/workout", payload);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to add workout");
  }

  return res.data.data; // inserted workout
};

/* Get Workouts */
export const getWorkouts = async () => {
  const res = await api.get("/workout");

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch workouts");
  }

  return Array.isArray(res.data.data?.workouts) ? res.data.data.workouts : [];
};

/* Get Workout Stats */
export const getWorkoutStats = async () => {
  const res = await api.get("/workout/stats");

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch stats");
  }

  return res.data.data;
};

/* Delete Workout */
export const deleteWorkout = async (id) => {
  const res = await api.delete(`/workout/${id}`);

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to delete workout");
  }

  return res.data.data;
};
