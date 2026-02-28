import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button className="w-full">Login</Button>
        </form>

        <p className="mt-4 text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
