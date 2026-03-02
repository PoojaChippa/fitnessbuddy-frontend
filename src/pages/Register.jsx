import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(form);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "User already exists or invalid data",
      );
    }
  };

  return (
    <div className="auth-split">
      {/* LEFT BRAND PANEL (Hidden on mobile) */}
      <div className="auth-left auth-left-register">
        <div className="auth-left-content">
          <h1 className="brand-title">FitnessBuddy</h1>

          <h2 className="brand-heading">
            Start Your <br /> Transformation.
          </h2>

          <p className="brand-subtext">
            Join a system built for discipline, growth, and consistency. Track
            progress, compete in groups, and stay accountable.
          </p>

          <div className="brand-highlight">
            <span>✔ Goal-Based Challenges</span>
            <span>✔ Workout Tracking</span>
            <span>✔ Smart Fitness Matching</span>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="auth-right">
        <Card className="auth-card">
          <div className="auth-header">
            <span className="auth-brand">FitnessBuddy</span>
            <h1 className="auth-heading">Create Account</h1>
            <p className="auth-subtitle">Start your transformation today.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="password-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="auth-button">
              Create Account
            </Button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/" className="auth-link">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
