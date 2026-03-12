import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const navItems = [
    { path: "/profile", label: "Profile" },
    { path: "/workouts", label: "Workouts" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/matches", label: "Matches" },
    { path: "/groups", label: "Groups" },
    { path: "/challenges", label: "Challenges" },
  ];

  const renderLinks = () =>
    navItems.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setSidebarOpen(false)}
          className={`sidebar-link ${isActive ? "sidebar-active" : ""}`}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-brand">FitnessBuddy</h1>

          <button
            className="sidebar-close md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">{renderLinks()}</nav>
      </aside>
    </>
  );
}
