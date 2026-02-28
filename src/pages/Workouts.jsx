// import { useCallback, useEffect, useState } from "react";
// import {
//   addWorkout,
//   getWorkouts,
//   deleteWorkout,
// } from "../services/workout.service";

// export default function Workouts() {
//   const [workouts, setWorkouts] = useState([]);
//   const [type, setType] = useState("");
//   const [duration, setDuration] = useState("");
//   const [loading, setLoading] = useState(true);

//   const loadWorkouts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const data = await getWorkouts();
//       setWorkouts(data);
//     } catch (err) {
//       console.error("LOAD WORKOUT ERROR:", err.message);
//       setWorkouts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadWorkouts();
//   }, [loadWorkouts]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!type || !duration) return;

//     try {
//       await addWorkout({
//         type,
//         duration: Number(duration),
//       });

//       setType("");
//       setDuration("");
//       await loadWorkouts();
//     } catch (err) {
//       console.error("ADD WORKOUT ERROR:", err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteWorkout(id);
//       await loadWorkouts();
//     } catch (err) {
//       console.error("DELETE ERROR:", err.message);
//     }
//   };

//   return (
//     <div className="p-8 space-y-8">
//       {/* Add Workout */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Add Workout</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             placeholder="Workout Type"
//             className="w-full border p-2 rounded"
//             required
//           />

//           <input
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             placeholder="Duration (minutes)"
//             type="number"
//             className="w-full border p-2 rounded"
//             required
//           />

//           <button className="w-full bg-black text-white py-2 rounded">
//             Add Workout
//           </button>
//         </form>
//       </div>

//       {/* Workout History */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Workout History</h2>

//         {loading ? (
//           <p>Loading...</p>
//         ) : workouts.length === 0 ? (
//           <p>No workouts yet</p>
//         ) : (
//           <div className="space-y-3">
//             {workouts.map((w) => (
//               <div
//                 key={w.id}
//                 className="flex justify-between items-center border p-3 rounded"
//               >
//                 <div>
//                   <p className="font-medium">{w.type}</p>
//                   <p className="text-sm text-gray-500">
//                     {w.duration} mins | {w.calories} cal
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => handleDelete(w.id)}
//                   className="text-red-500"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import {
  addWorkout,
  getWorkouts,
  deleteWorkout,
} from "../services/workout.service";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data || []);
    } catch (err) {
      console.error("LOAD WORKOUT ERROR:", err.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !duration) return;

    try {
      await addWorkout({
        type,
        duration: Number(duration),
      });

      setType("");
      setDuration("");
      await loadWorkouts();
    } catch (err) {
      console.error("ADD WORKOUT ERROR:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkout(id);
      await loadWorkouts();
    } catch (err) {
      console.error("DELETE ERROR:", err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-semibold">Workouts</h2>
        <p className="text-gray-500 text-sm">
          Track and manage your workout sessions
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Workout Card */}
        <div className="bg-white p-6 rounded-2xl shadow border lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Add Workout</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Workout Type (running, gym, etc.)"
              className="w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-3 rounded-lg outline-none transition"
              required
            />

            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (minutes)"
              type="number"
              className="w-full border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-3 rounded-lg outline-none transition"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Add Workout
            </button>
          </form>
        </div>

        {/* Workout History */}
        <div className="bg-white p-6 rounded-2xl shadow border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Workout History</h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-gray-500">No workouts yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workouts.map((w) => (
                <div
                  key={w.id}
                  className="flex justify-between items-center border border-gray-200 p-4 rounded-xl hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold capitalize">{w.type}</p>
                    <p className="text-sm text-gray-500">
                      {w.duration} mins • {w.calories} cal
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
