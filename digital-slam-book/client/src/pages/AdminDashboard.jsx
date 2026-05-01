import { useEffect, useMemo, useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api, { imageUrl } from "../services/api";

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter((entry) =>
      [entry.name, entry.nickname, entry.collegeName, entry.department, entry.batchYear, entry.rollNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [entries, search]);

  async function fetchEntries() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/slam");
      setEntries(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load entries.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await api.delete(`/slam/${deleteTarget._id}`);
      setEntries((current) => current.filter((entry) => entry._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete entry.");
    }
  }

  async function downloadPdf() {
    try {
      const response = await api.get("/slam/export/pdf", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "slam-book-entries.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Could not download PDF.");
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
      <section className="mb-7 flex flex-col justify-between gap-5 rounded-[2rem] bg-ink p-7 text-cream shadow-2xl lg:flex-row lg:items-center">
        <div>
          <p className="font-extrabold uppercase tracking-[0.28em] text-mango">Alumni Admin</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Manage passout entries</h1>
          <p className="mt-2 text-cream/70">{entries.length} alumni memories collected</p>
        </div>
        <button onClick={downloadPdf} className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-5 py-3 font-extrabold text-ink transition hover:bg-mango">
          <Download size={18} />
          Download PDF
        </button>
      </section>

      <div className="glass-card mb-6 flex items-center gap-3 rounded-[1.5rem] p-3">
        <Search className="ml-2 text-ink/50" />
        <input
          className="w-full bg-transparent px-2 py-3 font-bold text-ink outline-none placeholder:text-ink/45"
          placeholder="Search by name, college, batch, department, or roll number..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <LoadingSpinner label="Loading dashboard" />}
      {error && <p className="mb-5 rounded-2xl bg-coral/15 p-4 font-bold text-coral">{error}</p>}

      {!loading && (
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 shadow-xl shadow-ink/10 backdrop-blur-xl">
          <div className="hidden grid-cols-[88px_1.1fr_1fr_1fr_1fr_110px] gap-4 border-b border-ink/10 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-ink/55 lg:grid">
            <span>Photo</span>
            <span>Student</span>
            <span>College / Batch</span>
            <span>Journey</span>
            <span>Message</span>
            <span>Action</span>
          </div>

          {filteredEntries.map((entry) => (
            <article key={entry._id} className="grid gap-4 border-b border-ink/10 p-5 last:border-b-0 lg:grid-cols-[88px_1.1fr_1fr_1fr_1fr_110px] lg:items-center">
              <div className="h-20 w-20 overflow-hidden rounded-2xl bg-cream">
                {entry.image ? (
                  <img src={imageUrl(entry.image)} alt={entry.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-mango font-display text-3xl font-bold text-white">
                    {entry.name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display text-xl font-bold">{entry.name}</h3>
                <p className="text-sm font-bold text-coral">{entry.nickname || "No nickname"}</p>
                <p className="mt-1 text-xs font-bold text-ink/55">{entry.rollNumber || "No roll number"}</p>
                <p className="mt-1 text-xs text-ink/50">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>

              <div className="text-sm leading-6 text-ink/70">
                <p className="font-extrabold text-ink">{entry.collegeName || "No college"}</p>
                <p className="font-extrabold text-ink">{entry.batchYear || "No batch"}</p>
                <p>{entry.department || "No department"}</p>
              </div>

              <div className="text-sm leading-6 text-ink/70">
                <p>{entry.currentStatus || "No current status"}</p>
                <p className="font-bold text-coral">{entry.currentCity || ""}</p>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-ink/70">{entry.message || "No message added."}</p>

              <button
                onClick={() => setDeleteTarget(entry)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-coral/15 px-4 py-3 font-extrabold text-coral transition hover:bg-coral hover:text-white"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </article>
          ))}

          {!filteredEntries.length && (
            <div className="p-10 text-center">
              <h2 className="font-display text-2xl font-bold">No matching entries</h2>
              <p className="mt-2 text-ink/60">Try another search term.</p>
            </div>
          )}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title={`Delete ${deleteTarget.name}?`}
          message="This removes the entry and uploaded photo permanently."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}
