import { useEffect, useState } from "react";
import { createGroup, getMyGroups } from "../services/group.service";
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
      setGroups(data); // CONFIRMED: array
    } catch (err) {
      console.error("LOAD GROUPS ERROR:", err.message);
      setGroups([]);
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
      await loadGroups();
    } catch (err) {
      console.error("CREATE GROUP ERROR:", err.message);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Groups</h1>

      {/* Create Group */}
      <div className="card">
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            className="input"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="input"
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            <option value="calories">Calories</option>
            <option value="duration">Duration</option>
          </select>

          <input
            className="input"
            type="number"
            placeholder="Target Value"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
          />

          <button className="btn-primary w-full">Create Group</button>
        </form>
      </div>

      {/* Group List */}
      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : groups.length === 0 ? (
          <p>No groups yet</p>
        ) : (
          <div className="space-y-4">
            {groups.map((g) => (
              <div
                key={g.id}
                className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate(`/groups/${g.id}`)}
              >
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-gray-500">
                  Goal: {g.goal_type} | Target: {g.target_value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
