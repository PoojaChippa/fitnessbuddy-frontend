import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../services/match.service";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const res = await getMatches();

        if (!res.success) {
          setErrorMsg(res.message || "Unable to fetch matches");
          return;
        }

        setMatches(res.data);
      } catch (error) {
        if (error.response?.data?.message) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("Something went wrong while finding matches");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);
  if (loading) return <p className="p-6">Finding matches...</p>;

  if (errorMsg)
    return (
      <div className="p-10 text-center text-red-600">
        <p>{errorMsg}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      <h1 className="text-3xl font-bold">Your Fitness Matches</h1>

      {matches.length === 0 ? (
        <p>No matches found based on your profile.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {matches.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow rounded-xl p-6 space-y-4"
            >
              <div className="space-y-1">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
