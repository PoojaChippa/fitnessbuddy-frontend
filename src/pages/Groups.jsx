import { useEffect, useState } from "react";
import {
  createGroup,
  getMyGroups,
  deleteGroup,
} from "../services/group.service";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [goalType, setGoalType] = useState("calories");
  const [targetValue, setTargetValue] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadGroups = async () => {
    try {
      const data = await getMyGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name || !targetValue) return;

    try {
      await createGroup({
        name,
        goal_type: goalType,
        target_value: Number(targetValue),
      });

      setName("");
      setTargetValue("");

      loadGroups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group-page">
      {/* CREATE GROUP */}

      <div className="group-create">
        <h2 className="group-title">Create Group</h2>
        <p className="group-subtitle">Train together. Achieve together.</p>

        <form onSubmit={handleCreate} className="group-form">
          <input
            className="group-input"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="group-input"
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            <option value="calories">Calories</option>
            <option value="duration">Duration</option>
          </select>

          <input
            className="group-input"
            type="number"
            placeholder="Target Value"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />

          <button className="group-create-btn">Create Group</button>
        </form>
      </div>

      {/* MY GROUPS */}

      <div>
        <h2 className="group-title">My Groups</h2>
        <p className="group-subtitle">Collaborate and track shared goals</p>

        {loading ? (
          <p>Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-zinc-500">No groups yet</p>
        ) : (
          <div className="group-grid">
            {groups.map((g) => (
              <div key={g.id} className="group-card">
                <div
                  className="group-card-info"
                  onClick={() => navigate(`/groups/${g.id}`)}
                >
                  <p className="group-card-title">{g.name}</p>

                  <p className="group-card-desc">Goal: {g.goal_type}</p>

                  <p className="group-card-desc">Target: {g.target_value}</p>
                </div>

                <button
                  onClick={async () => {
                    if (!window.confirm("Delete this group?")) return;
                    await deleteGroup(g.id);
                    loadGroups();
                  }}
                  className="group-delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
