import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGroupProgress,
  getGroupLeaderboard,
  getGroupStats,
} from "../services/group.service";

export default function GroupDetails() {
  const { groupId } = useParams();

  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const progressData = await getGroupProgress(groupId);
        const leaderboardData = await getGroupLeaderboard(groupId);
        const statsData = await getGroupStats(groupId);

        setProgress(progressData);
        setLeaderboard(leaderboardData);
        setStats(statsData);
      } catch (err) {
        console.error("GROUP DETAILS ERROR:", err.message);
      }
    };

    loadData();
  }, [groupId]);

  if (!progress) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Group Overview</h1>

      {/* Progress */}
      <div className="card">
        <p>
          <strong>Goal Type:</strong> {progress.goalType}
        </p>
        <p>
          <strong>Target:</strong> {progress.targetValue}
        </p>
        <p>
          <strong>Achieved:</strong> {progress.achievedValue}
        </p>
        <p>
          <strong>Progress:</strong> {progress.percentage}%
        </p>
        <p>
          <strong>Total Workouts:</strong> {progress.totalWorkouts}
        </p>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h2 className="font-semibold mb-4">Leaderboard</h2>

        {leaderboard.map((user) => (
          <div key={user.userId} className="flex justify-between border-b py-2">
            <span>Rank {user.rank}</span>
            <span>{user.totalCalories} cal</span>
          </div>
        ))}
      </div>

      {/* Stats (Chart-ready data) */}
      <div className="card">
        <h2 className="font-semibold mb-4">Daily Stats</h2>

        {stats.map((day) => (
          <div key={day.date} className="flex justify-between border-b py-2">
            <span>{day.date}</span>
            <span>{day.calories} cal</span>
          </div>
        ))}
      </div>
    </div>
  );
}
