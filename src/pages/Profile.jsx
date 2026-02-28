// import { useEffect, useState } from "react";
// import { getProfile, updateProfile } from "../services/user.service";

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [form, setForm] = useState(null);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await getProfile();

//         // clone object to avoid shared reference
//         setProfile(data);
//         setForm({ ...data });
//       } catch (err) {
//         console.error("PROFILE LOAD ERROR:", err.message);
//       }
//     };

//     loadProfile();
//   }, []); // empty dependency array

//   const handleChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const updated = await updateProfile({
//         goal: form.goal || null,
//         workout_type: form.workout_type || null,
//         height: form.height ? Number(form.height) : null,
//         weight: form.weight ? Number(form.weight) : null,
//         gender: form.gender || null,
//         city: form.city || null,
//         postal_code: form.postal_code || null,
//         target_bmi: form.target_bmi ? Number(form.target_bmi) : null,
//       });

//       setProfile(updated);
//       setForm({ ...updated }); // clone again
//     } catch (err) {
//       console.error("PROFILE UPDATE ERROR:", err.message);
//     }
//   };

//   if (!profile || !form) {
//     return <p className="p-6">Loading...</p>;
//   }

//   return (
//     <div className="p-8 space-y-8">
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Profile Info</h2>

//         <p>
//           <strong>Goal:</strong> {profile.goal ?? "Not set"}
//         </p>
//         <p>
//           <strong>Workout Type:</strong> {profile.workout_type ?? "Not set"}
//         </p>
//         <p>
//           <strong>Height:</strong> {profile.height ?? "Not set"} cm
//         </p>
//         <p>
//           <strong>Weight:</strong> {profile.weight ?? "Not set"} kg
//         </p>
//         <p>
//           <strong>Gender:</strong> {profile.gender ?? "Not set"}
//         </p>
//         <p>
//           <strong>City:</strong> {profile.city ?? "Not set"}
//         </p>
//         <p>
//           <strong>Postal Code:</strong> {profile.postal_code ?? "Not set"}
//         </p>
//         <p>
//           <strong>Current BMI:</strong> {profile.bmi ?? "Not calculated"}
//         </p>
//         <p>
//           <strong>Target BMI:</strong> {profile.target_bmi ?? "Not set"}
//         </p>
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {[
//             "goal",
//             "workout_type",
//             "height",
//             "weight",
//             "gender",
//             "city",
//             "postal_code",
//             "target_bmi",
//           ].map((field) => (
//             <input
//               key={field}
//               name={field}
//               type={
//                 field === "height" ||
//                 field === "weight" ||
//                 field === "target_bmi"
//                   ? "number"
//                   : "text"
//               }
//               value={form[field] || ""}
//               onChange={handleChange}
//               placeholder={field.replace("_", " ")}
//               className="w-full border p-2 rounded"
//             />
//           ))}

//           <button className="w-full bg-black text-white py-2 rounded">
//             Update
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/user.service";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm({ ...data });
      } catch (err) {
        console.error("PROFILE LOAD ERROR:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updated = await updateProfile({
        goal: form.goal || null,
        workout_type: form.workout_type || null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        gender: form.gender || null,
        city: form.city || null,
        postal_code: form.postal_code || null,
        target_bmi: form.target_bmi ? Number(form.target_bmi) : null,
      });

      setProfile(updated);
      setForm({ ...updated });
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err.message);
    }
  };

  if (loading || !profile || !form) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-gray-500 text-sm">
          Manage your personal and fitness information
        </p>
      </div>

      {/* Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow border space-y-3">
          <h3 className="text-lg font-semibold mb-4">Profile Info</h3>

          <InfoItem label="Goal" value={profile.goal} />
          <InfoItem label="Workout Type" value={profile.workout_type} />
          <InfoItem
            label="Height"
            value={profile.height && `${profile.height} cm`}
          />
          <InfoItem
            label="Weight"
            value={profile.weight && `${profile.weight} kg`}
          />
          <InfoItem label="Gender" value={profile.gender} />
          <InfoItem label="City" value={profile.city} />
          <InfoItem label="Postal Code" value={profile.postal_code} />
          <InfoItem label="Current BMI" value={profile.bmi} />
          <InfoItem label="Target BMI" value={profile.target_bmi} />
        </div>

        {/* Update Form Card */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-lg font-semibold mb-6">Update Profile</h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              "goal",
              "workout_type",
              "height",
              "weight",
              "gender",
              "city",
              "postal_code",
              "target_bmi",
            ].map((field) => (
              <input
                key={field}
                name={field}
                type={
                  field === "height" ||
                  field === "weight" ||
                  field === "target_bmi"
                    ? "number"
                    : "text"
                }
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={field.replace("_", " ")}
                className="border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-3 rounded-lg outline-none transition"
              />
            ))}

            <button
              type="submit"
              className="col-span-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Small Reusable Info Item
========================= */
function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value ?? "Not set"}</span>
    </div>
  );
}
