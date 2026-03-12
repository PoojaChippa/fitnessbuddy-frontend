import { useCallback, useEffect, useState } from "react";
import {
  addWorkout,
  getWorkouts,
  deleteWorkout,
} from "../services/workout.service";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data || []);
    } catch (err) {
      console.error("LOAD WORKOUT ERROR:", err.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !duration) return;

    try {
      await addWorkout({
        type,
        duration: Number(duration),
      });

      setType("");
      setDuration("");
      await loadWorkouts();
    } catch (err) {
      console.error("ADD WORKOUT ERROR:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkout(id);
      await loadWorkouts();
    } catch (err) {
      console.error("DELETE ERROR:", err.message);
    }
  };

  return (
    <div className="page-container">
      {/* Page Title */}
      <div className="page-header">
        <h2 className="page-title">🏋 Workouts</h2>
        <p className="page-subtitle">Track and manage your workout sessions</p>
      </div>

      <div className="workout-layout">
        {/* Add Workout */}
        <div className="workout-form-card">
          <h3 className="card-title">Add Workout</h3>

          <form onSubmit={handleSubmit} className="workout-form">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="workout-input"
              required
            >
              <option value="">Select Workout</option>
              <option value="running">🏃 Running</option>
              <option value="cycling">🚴 Cycling</option>
              <option value="gym">🏋 Gym</option>
              <option value="walking">🚶 Walking</option>
              <option value="swimming">🏊 Swimming</option>
            </select>

            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (minutes)"
              type="number"
              className="workout-input"
              required
            />

            <button type="submit" className="workout-button">
              Add Workout
            </button>
          </form>
        </div>

        {/* Workout History */}
        <div className="workout-history-card">
          <h3 className="card-title">Workout History</h3>

          {loading ? (
            <div className="workout-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="workout-skeleton" />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <div className="workout-empty">
              <p>No workouts yet</p>
            </div>
          ) : (
            <div className="workout-grid">
              {workouts.map((w) => (
                <div key={w.id} className="workout-card">
                  <div className="workout-left">
                    <span className="workout-icon">
                      {w.type === "running" && "🏃"}
                      {w.type === "cycling" && "🚴"}
                      {w.type === "gym" && "🏋"}
                      {w.type === "walking" && "🚶"}
                      {w.type === "swimming" && "🏊"}
                    </span>

                    <div>
                      <p className="workout-type">{w.type}</p>
                      <p className="workout-meta">
                        {w.duration} mins • {w.calories} cal
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(w.id)}
                    className="workout-delete"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
