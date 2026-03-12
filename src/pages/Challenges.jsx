import { useEffect, useState } from "react";

import {
  createChallenge,
  joinChallenge,
  logChallengeProgress,
  getMyChallenges,
  getAllChallenges,
  getLeaderboard,
  exitChallenge,
  deleteChallenge,
} from "../services/challenge.service";

export default function Challenges() {
  const [myChallenges, setMyChallenges] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalType, setGoalType] = useState("calories");
  const [targetValue, setTargetValue] = useState("");

  const [progressValue, setProgressValue] = useState({});
  const [leaderboard, setLeaderboard] = useState({});
  const myChallengeIds = new Set(myChallenges.map((c) => c.id));
  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
  /* LOAD DATA */

  const loadData = async () => {
    try {
      const mine = await getMyChallenges();
      const all = await getAllChallenges();

      setMyChallenges(mine.data || []);
      setAllChallenges(all.data || []);

      const lb = {};

      for (const challenge of mine.data) {
        const res = await getLeaderboard(challenge.id);

        lb[challenge.id] = res.data || [];
      }

      setLeaderboard(lb);
    } catch (err) {
      console.error("Challenge load error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  /* CREATE */

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !description || !targetValue) {
      alert("Fill all fields");
      return;
    }

    await createChallenge({
      title,
      description,
      goal_type: goalType,
      target_value: Number(targetValue),
    });

    setTitle("");
    setDescription("");
    setTargetValue("");

    loadData();
  };

  /* JOIN */

  const handleJoin = async (id) => {
    try {
      await joinChallenge({
        challenge_id: id,
      });

      loadData();
    } catch (err) {
      console.error("Join error:", err);
    }
  };

  /* LOG PROGRESS */

  const handleLog = async (challengeId) => {
    const progress = progressValue[challengeId];

    if (!progress) {
      alert("Enter progress value");
      return;
    }

    try {
      await logChallengeProgress({
        challenge_id: challengeId,
        progress_value: Number(progress),
      });

      setProgressValue((prev) => ({
        ...prev,
        [challengeId]: "",
      }));

      loadData();
    } catch (err) {
      console.error("Log progress error:", err);
    }
  };
  const handleExit = async (id) => {
    try {
      await exitChallenge(id);

      loadData();
    } catch (err) {
      console.error("Exit error:", err);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this challenge?",
    );

    if (!confirmDelete) return;

    try {
      await deleteChallenge(id);

      loadData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="challenges-container">
      {/* CREATE CHALLENGE */}

      <div className="challenge-create-card">
        <h3 className="challenge-title">Create Challenge</h3>

        <form onSubmit={handleCreate} className="challenge-form">
          <input
            className="challenge-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="challenge-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="challenge-select"
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            <option value="calories">Calories</option>
            <option value="steps">Steps</option>
            <option value="duration">Duration</option>
          </select>

          <input
            type="number"
            className="challenge-input"
            placeholder="Target value"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />

          <button className="challenge-create-btn">Create Challenge</button>
        </form>
      </div>

      {/* DISCOVER */}

      <h3 className="section-title">Discover Challenges</h3>

      <div className="challenge-grid">
        {allChallenges
          .filter((c) => !myChallengeIds.has(c.id))
          .map((c) => (
            <div key={c.id} className="challenge-card">
              <h4 className="card-title">{c.title}</h4>

              <p className="card-desc">{c.description}</p>

              <p className="card-goal">
                Goal: {c.target_value} {c.goal_type}
              </p>

              <button
                className="challenge-join-btn"
                onClick={() => handleJoin(c.id)}
              >
                Join
              </button>
            </div>
          ))}
      </div>

      {/* MY CHALLENGES */}

      <h3 className="section-title">My Challenges</h3>

      <div className="challenge-grid">
        {myChallenges.map((c) => {
          const percent = Math.min(
            ((c.totalProgress || 0) / c.target_value) * 100,
            100,
          );

          return (
            <div key={c.id} className="challenge-card">
              <h4 className="card-title">{c.title}</h4>

              <p className="card-desc">{c.description}</p>

              <p className="card-goal">
                Goal: {c.target_value} {c.goal_type}
              </p>

              {/* PROGRESS BAR */}

              <div className="challenge-progress-bar">
                <div
                  className="challenge-progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="leaderboard">
                <p className="leaderboard-title">🏆 Leaderboard</p>

                {(leaderboard[c.id] || []).map((user, i) => (
                  <div key={i} className="leaderboard-row">
                    {i + 1}. {user.user} — {user.total}
                  </div>
                ))}
              </div>

              <div className="challenge-actions">
                <input
                  type="number"
                  placeholder="Progress"
                  className="challenge-progress-input"
                  value={progressValue[c.id] || ""}
                  onChange={(e) =>
                    setProgressValue({
                      ...progressValue,
                      [c.id]: e.target.value,
                    })
                  }
                />

                <button
                  className="challenge-log-btn"
                  onClick={() => handleLog(c.id)}
                >
                  Log
                </button>

                {c.owner_id === currentUserId ? (
                  <button
                    className="challenge-delete-btn"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className="challenge-exit-btn"
                    onClick={() => handleExit(c.id)}
                  >
                    Exit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
