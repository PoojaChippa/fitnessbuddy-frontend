import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* load user from localStorage */

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  /* close dropdown when clicking outside */

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const userEmail = user?.email || "";

  const rawName =
    user?.user_metadata?.name || userEmail.split("@")[0] || "User";
  const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const initial = userName.charAt(0);

  return (
    <div className="profile-menu" ref={ref}>
      {/* Avatar Button */}

      <button onClick={() => setOpen(!open)} className="profile-avatar">
        {initial}
      </button>

      {open && (
        <div className="profile-dropdown">
          {/* User Info */}

          <div className="profile-user">
            <div className="profile-user-avatar">{initial}</div>

            <div>
              <p className="profile-user-name">{userName}</p>

              <p className="profile-user-email">{userEmail}</p>
            </div>
          </div>

          {/* Actions */}

          <div className="profile-actions">
            <Link
              to="/profile"
              className="profile-action"
              onClick={() => setOpen(false)}
            >
              View Profile
            </Link>

            <button onClick={handleLogout} className="profile-logout">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
