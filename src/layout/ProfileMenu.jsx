import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "User";
  const userEmail = storedUser?.email || "";
  const initial = userName.charAt(0).toUpperCase();

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
  return (
    <div className="profile-menu" ref={ref}>
      <button onClick={() => setOpen(!open)} className="profile-avatar">
        {initial}
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-user">
            <div className="profile-user-avatar">{initial}</div>

            <div>
              <p className="profile-user-name">{userName}</p>
              <p className="profile-user-email">{userEmail}</p>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/profile" className="profile-action">
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
