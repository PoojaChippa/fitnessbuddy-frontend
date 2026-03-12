import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function BMIProgress({ currentBMI, targetBMI }) {
  const progress = Math.min((targetBMI / currentBMI) * 100, 100);

  return (
    <div className="bmi-progress-card">
      <h3 className="bmi-title">BMI Goal Progress</h3>

      <div className="bmi-circle">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            textSize: "16px",
            pathColor: "#8e2de2",
            textColor: "#8e2de2",
            trailColor: "#eee",
          })}
        />
      </div>

      <p className="bmi-info">Current BMI: {currentBMI}</p>

      <p className="bmi-info">Target BMI: {targetBMI}</p>
    </div>
  );
}
