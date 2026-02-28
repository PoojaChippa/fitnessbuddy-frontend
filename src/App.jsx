import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <Route path="*" element={<Login />} />
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
