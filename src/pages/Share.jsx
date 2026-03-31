import { useEffect, useState } from "react";
import { shareProgress, getMyFeed } from "../services/share.service";
import { getWorkouts } from "../services/workout.service";
import { getMyGroups } from "../services/group.service";
import { getMyChallenges } from "../services/challenge.service";

export default function Share() {
  const [shareType, setShareType] = useState("workout");
  const [referenceId, setReferenceId] = useState("");

  const [items, setItems] = useState([]);
  const [feed, setFeed] = useState([]);

  /* LOAD FEED */

  const loadFeed = async () => {
    try {
      const res = await getMyFeed();
      const data = res?.data || res || [];
      setFeed(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD FEED ERROR:", err.message);
      setFeed([]);
    }
  };

  /* LOAD SHAREABLE ITEMS */

  const loadItems = async () => {
    try {
      let res;

      if (shareType === "workout") {
        res = await getWorkouts();
      }

      if (shareType === "group") {
        res = await getMyGroups();
      }

      if (shareType === "challenge") {
        res = await getMyChallenges();
      }

      const data = res?.data || res || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD ITEMS ERROR:", err.message);
      setItems([]);
    }
  };

  /* EFFECTS */

  useEffect(() => {
    const initFeed = async () => {
      await loadFeed();
    };
    initFeed();
  }, []);

  useEffect(() => {
    const initItems = async () => {
      await loadItems();
    };
    initItems();
  }, [shareType]);

  /* SHARE */

  const handleShare = async (e) => {
    e.preventDefault();

    if (!referenceId) {
      alert("Please select activity to share");
      return;
    }

    try {
      await shareProgress({
        receiver_id: null,
        share_type: shareType,
        reference_id: referenceId,
      });

      setReferenceId("");

      await loadFeed();

      alert("Progress shared with your buddies!");
    } catch (err) {
      console.error("SHARE ERROR:", err.response?.data || err.message);
    }
  };

  /* SOCIAL SHARE */

  const shareToSocial = (item, platform) => {
    const text =
      item.type === "workout"
        ? `I just completed a workout on FitnessBuddy 💪`
        : `Check out my ${item.type} progress on FitnessBuddy 💪`;

    if (platform === "whatsapp") {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }

    if (platform === "instagram") {
      navigator.clipboard.writeText(text);

      alert("Caption copied! Paste it in Instagram.");

      window.open("https://instagram.com", "_blank");
    }
  };

  return (
    <div className="share-page">
      <div className="share-header">
        <h1 className="share-title">Share Progress</h1>
        <p className="share-subtitle">
          Share your fitness achievements with friends
        </p>
      </div>

      {/* SHARE FORM */}

      <div className="share-form-card">
        <h2 className="card-title">Share Activity</h2>

        <form onSubmit={handleShare} className="share-form-grid">
          <select
            className="input"
            value={shareType}
            onChange={(e) => setShareType(e.target.value)}
          >
            <option value="workout">Workout</option>
            <option value="challenge">Challenge</option>
            <option value="group">Group</option>
          </select>

          <select
            className="input"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
          >
            <option value="">Select Activity</option>

            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {shareType === "workout" &&
                  `${item.type} - ${item.calories} cal`}

                {shareType === "group" && `${item.name} (${item.goal_type})`}

                {shareType === "challenge" &&
                  `${item.title} - ${item.target_value}`}
              </option>
            ))}
          </select>

          <button className="btn-primary" disabled={!referenceId}>
            Share Progress
          </button>
        </form>
      </div>

      {/* FEED */}

      <div className="share-feed-card">
        <h2 className="card-title">Your Feed</h2>

        {feed.length === 0 ? (
          <p className="text-zinc-500 text-sm">No shared activities yet.</p>
        ) : (
          <div className="space-y-4">
            {feed.map((item, index) => (
              <div key={index} className="share-feed-item">
                <div className="share-feed-content">
                  <p className="share-feed-title">{item.type} Shared</p>

                  {item.details && (
                    <p className="share-feed-details">
                      {item.type === "workout" &&
                        `${item.details.type} • ${item.details.calories} calories`}

                      {item.type === "challenge" &&
                        `${item.details.title} • Target ${item.details.target_value}`}

                      {item.type === "group" &&
                        `${item.details.name} • Goal ${item.details.target_value}`}
                    </p>
                  )}

                  <p className="share-feed-date">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="share-social-buttons">
                  <button
                    onClick={() => shareToSocial(item, "whatsapp")}
                    className="btn-social"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={() => shareToSocial(item, "instagram")}
                    className="btn-social-outline"
                  >
                    Instagram
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
