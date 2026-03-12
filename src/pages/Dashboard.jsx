import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard.service";
import StatCard from "../components/dashboard/StatsCard";
import Charts from "../components/dashboard/Charts";
import BMIProgress from "../components/dashboard/BMIProgress";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);
  const bmiColors = {
    Underweight: "text-blue-500",
    Normal: "text-green-500",
    Overweight: "text-yellow-500",
    Obese: "text-red-500",
  };

  /* =========================
     LOADING STATE
  ========================= */

  if (!data) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="dashboard-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dashboard-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     MAIN DASHBOARD
  ========================= */

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">
          Track your fitness progress and analytics
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="dashboard-grid">
        <StatCard title="Total Workouts" value={data.totalWorkouts ?? 0} />

        <StatCard
          title="Calories Burnt"
          value={data.totalCaloriesBurned ?? 0}
        />

        <StatCard title="Current BMI" value={data.currentBMI ?? "—"} />

        <StatCard title="Target BMI" value={data.targetBMI ?? "—"} />

        <StatCard
          title="BMI Category"
          value={data.bmiCategory ?? "—"}
          color={bmiColors[data.bmiCategory]}
        />
        {/* SHOW ONLY ONE GOAL */}

        <StatCard
          title={data.weightToGain ? "Weight To Gain" : "Weight To Lose"}
          value={`${data.weightToGain || data.weightToLose} kg`}
        />

        <StatCard
          title="Days To Target"
          value={data.estimatedDaysToTarget ?? "—"}
        />
      </div>

      {/* CHARTS */}
      <Charts data={data} />

      {/* BMI PROGRESS */}
      <BMIProgress currentBMI={data.currentBMI} targetBMI={data.targetBMI} />
    </div>
  );
}
