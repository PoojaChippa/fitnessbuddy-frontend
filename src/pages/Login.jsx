import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="auth-split">
      {/* LEFT BRAND PANEL (Hidden on mobile) */}
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 className="brand-title">FitnessBuddy</h1>

          <h2 className="brand-heading">
            Train Hard. <br /> Stay Consistent.
          </h2>

          <p className="brand-subtext">
            Track workouts, monitor progress, and build discipline with a system
            designed to push you forward.
          </p>

          <div className="brand-highlight">
            <span>✔ Progress Tracking</span>
            <span>✔ Smart Matching</span>
            <span>✔ Goal-Based Groups</span>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="auth-right">
        <Card className="auth-card">
          <div className="auth-header">
            <span className="auth-brand">FitnessBuddy</span>
            <h1 className="auth-heading">Welcome Back</h1>
            <p className="auth-subtitle">Continue your fitness journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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

            {error && <p className="auth-error">{error}</p>}

            <Button type="submit" className="auth-button">
              Login
            </Button>
          </form>

          <p className="auth-footer">
            No account?{" "}
            <Link to="/register" className="auth-link">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
