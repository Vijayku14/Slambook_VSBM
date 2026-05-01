import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-extrabold transition ${
    isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-white/60 hover:text-ink"
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("slam_admin_token");

  function logout() {
    localStorage.removeItem("slam_admin_token");
    navigate("/admin/login");
  }

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white p-2 shadow-glow">
          <img src="/vsbm-logo.png" alt="VSBM logo" className="max-h-full max-w-full object-contain" />
        </span>
        <span className="font-display text-xl font-bold tracking-tight text-ink">VSBM AlumniNest</span>
      </Link>

      <nav className="flex items-center gap-2 rounded-full border border-white/50 bg-white/35 p-1 backdrop-blur-xl">
        <NavLink to="/gallery" className={linkClass}>
          <span className="hidden sm:inline">Gallery</span>
          <BookOpen className="sm:hidden" size={18} />
        </NavLink>
        <NavLink to="/admin" className={linkClass}>
          <span className="hidden sm:inline">Admin</span>
          <LayoutDashboard className="sm:hidden" size={18} />
        </NavLink>
        {token && (
          <button
            onClick={logout}
            className="rounded-full px-3 py-2 text-ink/70 transition hover:bg-white/60 hover:text-ink"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </nav>
    </header>
  );
}
