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
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Profile</h2>
          <p>Manage your personal and fitness information</p>
        </div>

        <div className="profile-grid">
          {/* Profile Info */}
          <div className="profile-card">
            <h3 className="profile-card-title">Profile Info</h3>

            <div className="profile-info-list">
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
          </div>

          {/* Update Profile */}
          <div className="profile-card">
            <h3 className="profile-card-title">Update Profile</h3>

            <form onSubmit={handleSubmit} className="profile-form">
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
                  className="profile-input"
                />
              ))}

              <button type="submit" className="profile-button">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
function InfoItem({ label, value }) {
  return (
    <div className="profile-info-item">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value ?? "Not set"}</span>
    </div>
  );
}
