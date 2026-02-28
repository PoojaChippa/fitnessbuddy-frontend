import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItem = (path, label) => (
    <Link
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={`block px-4 py-2 rounded-xl transition ${
        location.pathname === path
          ? "bg-white/20 text-white shadow"
          : "text-gray-200 hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-50 top-0 left-0 h-full w-64
          bg-gradient-to-b from-indigo-600 to-purple-700
          text-white p-6 flex flex-col justify-between
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-2xl font-bold tracking-wide">FitnessBuddy</h1>

              <button
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-3">
              {navItem("/dashboard", "Dashboard")}
              {navItem("/workouts", "Workouts")}
              {navItem("/profile", "Profile")}
            </nav>
          </div>
        </aside>

        {/* Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================
   HEADER COMPONENT
========================= */

function Header({ onMenuClick }) {
  return (
    <header className="bg-white/70 backdrop-blur-md shadow-sm px-6 py-4 flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={onMenuClick}>
          <Menu />
        </button>

        <h1 className="text-lg font-semibold text-gray-700">
          Fitness Dashboard
        </h1>
      </div>

      <ProfileMenu />
    </header>
  );
}

/* =========================
   PROFILE DROPDOWN
========================= */

function ProfileMenu() {
  const [open, setOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "User";
  const userEmail = storedUser?.email || "";
  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 cursor-pointer rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg"
      >
        {initial}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border p-4 z-50">
          <div className="mb-3">
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>

          <div className="border-t pt-3 space-y-2">
            <a
              href="/profile"
              className="block text-gray-700 hover:text-purple-600 transition"
            >
              View Profile
            </a>

            <button
              onClick={handleLogout}
              className="w-full text-left text-red-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
