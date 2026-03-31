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
    try {
      await joinGroup(groupId);
      setJoined(true);
      await loadAll();
    } catch (err) {
      console.error("JOIN GROUP ERROR:", err);
    }
  };

  const handleLeave = async () => {
    await leaveGroup(groupId);

    setJoined(false);
    setProgress(null);
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();

    if (!workoutType || !duration) return;

    const calories = Number(duration) * 8;

    await logGroupWorkout(groupId, {
      type: workoutType,
      duration: Number(duration),
      calories,
    });

    setWorkoutType("");
    setDuration("");

    await loadAll();
  };

  if (loading) return <div className="group-loading">Loading...</div>;

  if (!joined)
    return (
      <div className="group-join-container">
        <h2 className="group-join-title">Join This Group</h2>

        <button onClick={handleJoin} className="group-join-btn">
          Join Group
        </button>
      </div>
    );

  return (
    <div className="group-details-page">
      {/* HEADER */}

      <div className="group-details-header">
        <h1 className="group-details-title">Group Overview</h1>

        <button onClick={handleLeave} className="group-leave-btn">
          Leave Group
        </button>
      </div>

      {/* LOG WORKOUT */}

      <div className="group-card">
        <h2 className="group-card-title">Log Group Workout</h2>

        <form onSubmit={handleLogWorkout} className="group-workout-form">
          <input
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Workout Type"
            className="group-input"
          />

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
            className="group-input"
          />

          <button className="group-primary-btn">Log Workout</button>
        </form>
      </div>

      {/* PROGRESS */}
      {progress && (
        <div className="group-card">
          <h2 className="group-card-title heading-underline">Progress</h2>

          <div className="group-progress-row">
            <div className="group-progress-bar">
              <div
                className="group-progress-fill"
                style={{
                  width: `${progress.percentage}%`,
                  minWidth: "12px",
                }}
              />
            </div>

            <span className="group-progress-value">
              {progress.achievedValue} / {progress.targetValue}
            </span>
          </div>
        </div>
      )}
      {/* DAILY CHART */}

      <div className="chart-card">
        <h2 className="chart-title">Daily Progress</h2>

        {stats.length < 2 && (
          <p className="chart-note">
            Log workouts on multiple days to see a trend graph.
          </p>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={stats}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
          >
            <XAxis dataKey="date" />
            <YAxis padding={{ top: 20, bottom: 20 }} />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="calories"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* LEADERBOARD + MEMBERS GRID */}

      <div className="group-bottom-grid">
        {/* LEADERBOARD */}

        <div className="group-card">
          <h2 className="group-card-title heading-underline">Leaderboard</h2>

          <div className="group-leaderboard">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-zinc-500">No leaderboard data yet</p>
            ) : (
              leaderboard.map((user) => (
                <div key={user.userId} className="group-leaderboard-row">
                  <div className="group-leaderboard-left">
                    <span className="group-rank">#{user.rank}</span>

                    <span className="group-user">User</span>
                  </div>

                  <span className="group-calories">
                    {user.totalCalories} cal
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MEMBERS */}

        <div className="group-card">
          <h2 className="group-card-title heading-underline">Members</h2>

          <div className="group-members">
            {members.length === 0 ? (
              <p className="text-sm text-zinc-500">No members yet</p>
            ) : (
              members.map((m) => (
                <div key={m.user_id} className="group-member-row">
                  <div className="group-avatar">
                    {m.users?.name?.charAt(0) || "U"}
                  </div>

                  <span className="group-member-name">
                    {m.users?.name || "User"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
