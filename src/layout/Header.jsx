import { useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

export default function Header({ setSidebarOpen, darkMode, setDarkMode }) {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("profile")) return "Profile";
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("workouts")) return "Workouts";
    if (location.pathname.includes("matches")) return "Matches";
    if (location.pathname.includes("groups")) return "Groups";
    if (location.pathname.includes("challenge")) return "Challenges";
    if (location.pathname.includes("share")) return "Share";
    if (location.pathname.includes("gym")) return "Find Gym";
    return "FitnessBuddy";
  };

  const getEmoji = () => {
    if (location.pathname.includes("profile")) return "👤";
    if (location.pathname.includes("dashboard")) return "📊";
    if (location.pathname.includes("workouts")) return "🏋️";
    if (location.pathname.includes("matches")) return "🤝";
    if (location.pathname.includes("groups")) return "👥";
    if (location.pathname.includes("challenge")) return "🤜🤛";
    if (location.pathname.includes("share")) return "📢";
    if (location.pathname.includes("gym")) return "📍";
    return "🔥";
  };

  return (
    <header className="layout-header sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        <h1 className="header-title flex items-center gap-2">
          <span className="header-emoji">{getEmoji()}</span>
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <ProfileMenu />
      </div>
    </header>
  );
}
