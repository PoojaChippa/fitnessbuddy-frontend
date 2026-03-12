import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../services/match.service";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [retryCooldown, setRetryCooldown] = useState(false);

  const navigate = useNavigate();

  /* =========================
     LOAD MATCHES
  ========================= */

  const loadMatches = async () => {
    if (retryCooldown) return;

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await getMatches();
      console.log(res);
      if (!res.success) {
        setErrorMsg(res.message || "Unable to fetch matches");
        return;
      }

      setMatches(res.data || []);
    } catch (error) {
      if (error.response?.status === 429) {
        setErrorMsg("Too many requests. Please wait a moment.");

        setRetryCooldown(true);

        setTimeout(() => {
          setRetryCooldown(false);
        }, 15000);
      } else if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong while finding matches.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadMatches();
  }, []);

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <div className="matches-container">
        <div className="matches-header">
          <h1 className="matches-title">Your Fitness Matches</h1>

          <p className="matches-subtitle">
            Finding people with similar fitness goals...
          </p>
        </div>

        <div className="matches-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="match-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */

  if (errorMsg) {
    return (
      <div className="matches-container">
        <div className="matches-error">
          <p>{errorMsg}</p>

          <button
            onClick={loadMatches}
            disabled={retryCooldown}
            className="match-button mt-4 disabled:opacity-50"
          >
            {retryCooldown ? "Please wait..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="matches-container">
      <div className="matches-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="matches-title">Your Fitness Matches</h1>

            <p className="matches-subtitle">
              Connect with people who share similar fitness goals.
            </p>
          </div>

          <button
            onClick={loadMatches}
            disabled={loading}
            className="refresh-button"
          >
            Refresh
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="matches-empty">
          No matches found based on your profile.
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((user) => (
            <div key={user.id} className="match-card">
              <div className="match-header">
                <div className="match-user">
                  <div className="match-avatar">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </div>

                  <div className="match-name">{user.name}</div>
                </div>

                <span className="match-score">
                  {user.match_score || "80%"} Match
                </span>
              </div>

              <div className="match-info">
                <p>
                  <strong>Goal:</strong> {user.goal}
                </p>

                <p>
                  <strong>Workout:</strong> {user.workout_type}
                </p>

                <p>
                  <strong>City:</strong> {user.city}
                </p>

                <p>
                  <strong>Gender:</strong> {user.gender}
                </p>
              </div>

              <button
                onClick={() => navigate(`/messages/${user.id}`)}
                className="match-button"
              >
                Message Buddy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
