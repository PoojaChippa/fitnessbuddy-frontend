import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  logGroupWorkout,
  getGroupProgress,
  getGroupLeaderboard,
  getGroupStats,
  joinGroup,
  leaveGroup,
  checkGroupMembership,
  getGroupMembers,
} from "../services/group.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState([]);
  const [members, setMembers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const progressData = await getGroupProgress(groupId);
    const leaderboardData = await getGroupLeaderboard(groupId);
    const statsData = await getGroupStats(groupId);
    const membersData = await getGroupMembers(groupId);

    setProgress(progressData);
    setLeaderboard(leaderboardData);
    setStats(statsData);
    setMembers(membersData);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const isMember = await checkGroupMembership(groupId);
      setJoined(isMember);

      if (isMember) await loadAll();

      setLoading(false);
    };

    init();
  }, [groupId]);

  const handleJoin = async () => {
    await joinGroup(groupId);
    setJoined(true);
    await loadAll();
  };
  const handleLogWorkout = async (e) => {
    e.preventDefault();

    if (!workoutType || !duration) return;

    try {
      await logGroupWorkout(groupId, {
        type: workoutType,
        duration: Number(duration),
      });

      setWorkoutType("");
      setDuration("");

      // reload updated data
      await loadAll();
    } catch (err) {
      console.error("LOG GROUP WORKOUT ERROR:", err.message);
    }
  };

  const handleLeave = async () => {
    await leaveGroup(groupId);
    setJoined(false);
    setProgress(null);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  if (!joined)
    return (
      <div className="p-10 text-center space-y-6">
        <h2 className="text-2xl font-bold">Join This Group</h2>
        <button
          onClick={handleJoin}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Join Group
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Group Overview</h1>
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Leave Group
        </button>
      </div>
      {/* Log Workout */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Log Group Workout</h2>

        <form onSubmit={handleLogWorkout} className="grid md:grid-cols-3 gap-4">
          <input
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Workout type"
            className="border rounded px-3 py-2"
            required
          />

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
            className="border rounded px-3 py-2"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            Log Workout
          </button>
        </form>
      </div>
      {/* Progress Bar */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Progress</h2>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        <p>
          {progress.achievedValue} / {progress.targetValue} (
          {progress.percentage}%)
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Calories</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>

        {leaderboard.map((user) => (
          <div key={user.userId} className="flex justify-between border-b py-2">
            <span>Rank {user.rank}</span>
            <span>{user.totalCalories} cal</span>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Members</h2>

        {members.map((m) => (
          <div key={m.user_id} className="border-b py-2">
            {m.users?.name || m.user_id}
          </div>
        ))}
      </div>
    </div>
  );
}
