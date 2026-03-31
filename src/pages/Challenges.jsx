import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

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

  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
  const myChallengeIds = new Set(myChallenges.map((c) => c.id));

  const loadData = async () => {
    try {
      const mine = await getMyChallenges();
      const all = await getAllChallenges();

      const mineData = mine?.data || [];
      const allData = all?.data || [];

      setMyChallenges(mineData);
      setAllChallenges(allData);

      const lb = {};

      for (const c of mineData) {
        try {
          const res = await getLeaderboard(c.id);
          lb[c.id] = res?.data || [];
        } catch (error) {
          console.error("Leaderboard error:", error);
          lb[c.id] = [];
        }
      }

      setLeaderboard(lb);
    } catch (error) {
      console.error("Challenge load failed:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadData();
    };

    init();
  }, []);
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

  const handleJoin = async (id) => {
    await joinChallenge({ challenge_id: id });
    loadData();
  };

  const handleLog = async (id) => {
    const progress = progressValue[id];

    if (!progress) {
      alert("Enter progress");
      return;
    }

    await logChallengeProgress({
      challenge_id: id,
      progress_value: Number(progress),
    });

    setProgressValue({ ...progressValue, [id]: "" });
    loadData();
  };

  const handleExit = async (id) => {
    await exitChallenge(id);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete challenge?")) return;

    await deleteChallenge(id);
    loadData();
  };

  return (
    <div className="challenge-page">
      {/* CREATE */}

      <Card>
        <CardHeader>
          <CardTitle className="challenge-section-title">
            Create Challenge
          </CardTitle>
          <p className="challenge-subtitle">
            Set a goal. Stay consistent. Challenge yourself.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreate} className="challenge-form">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
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

            <Input
              type="number"
              placeholder="Target"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />

            <Button className="create-btn">Create Challenge</Button>
          </form>
        </CardContent>
      </Card>

      {/* DISCOVER */}

      <h2 className="challenge-section-title">Discover Challenges</h2>

      <p className="challenge-subtitle">
        Push your limits. Stay disciplined. Beat yesterday.
      </p>

      <div className="discover-grid">
        {allChallenges
          .filter((c) => !myChallengeIds.has(c.id))
          .map((c) => (
            <Card key={c.id} className="challenge-card-discover">
              <CardContent>
                <h3 className="card-title">{c.title}</h3>

                <p className="card-desc">Description: {c.description}</p>

                <p className="card-goal">
                  Goal: {c.target_value} {c.goal_type}
                </p>

                <p className="challenge-members">
                  👥 {c.participants || 0} joined
                </p>

                <Button className="join-btn" onClick={() => handleJoin(c.id)}>
                  Join
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* MY CHALLENGES */}

      <h2 className="challenge-section-title">My Challenges</h2>

      <p className="challenge-subtitle">
        Track your progress and climb the leaderboard.
      </p>

      <div className="challenge-grid">
        {myChallenges.map((c) => {
          const percent = Math.min(
            ((c.totalProgress || 0) / c.target_value) * 100,
            100,
          );

          return (
            <Card key={c.id} className="challenge-card">
              <CardContent>
                <h3 className="card-title">{c.title}</h3>

                <p className="card-desc">Description: {c.description}</p>

                <p className="card-goal">
                  Goal: {c.target_value} {c.goal_type}
                </p>

                <div className="challenge-progress">
                  <Progress value={percent} className="progress-bar" />
                  <div className="progress-meta">
                    <span>{Math.round(percent)}%</span>
                  </div>
                </div>

                <div className="leaderboard">
                  <p className="leaderboard-title">🏆 Leaderboard</p>

                  {(leaderboard[c.id] || []).map((u, i) => (
                    <div key={i} className="leaderboard-row">
                      {i + 1}. {u.user} — {u.total}
                    </div>
                  ))}
                </div>

                <div className="challenge-actions">
                  <div className="challenge-progress-row">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter progress"
                      value={progressValue[c.id] || ""}
                      onChange={(e) =>
                        setProgressValue({
                          ...progressValue,
                          [c.id]: e.target.value,
                        })
                      }
                    />

                    <Button className="log-btn" onClick={() => handleLog(c.id)}>
                      Log Progress
                    </Button>
                  </div>
                  <div className="challenge-danger-row">
                    {String(c.owner_id) === String(currentUserId) ? (
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete Challenge
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => handleExit(c.id)}
                      >
                        Exit Challenge
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
