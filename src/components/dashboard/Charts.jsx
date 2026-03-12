import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#ff512f", "#dd2476", "#8e2de2"];

export default function Charts({ data }) {
  const pieData = [
    { name: "Weekly Calories", value: data.weeklyCalories || 0 },
    { name: "Monthly Calories", value: data.monthlyCalories || 0 },
  ];

  const barData = [
    { name: "Calories", value: data.totalCaloriesBurned || 0 },
    { name: "Workouts", value: data.totalWorkouts || 0 },
  ];

  return (
    <div className="charts-grid">
      {/* Pie Chart */}
      <div className="chart-card">
        <h3>Calorie Distribution</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="chart-card">
        <h3>Workout Summary</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8e2de2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
