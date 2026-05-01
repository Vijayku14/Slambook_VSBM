import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@slambook.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("slam_admin_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-lg place-items-center px-4 pb-14">
      <form onSubmit={handleSubmit} className="glass-card w-full rounded-[2rem] p-7">
        <div className="mb-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink text-cream">
            <LockKeyhole />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-ink/65">Manage alumni entries, search batches, export PDFs, and clean up submissions.</p>
        </div>

        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-extrabold">Email</span>
            <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-extrabold">Password</span>
            <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>

          {error && <p className="rounded-2xl bg-coral/15 p-4 text-sm font-bold text-coral">{error}</p>}

          <button disabled={loading} className="btn-primary w-full px-6 py-4 disabled:opacity-60">
            {loading ? <LoadingSpinner label="Signing in" /> : "Login"}
          </button>
        </div>
      </form>
    </main>
  );
}
