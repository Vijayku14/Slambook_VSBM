import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EntryCard from "../components/EntryCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api";

export default function Gallery() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchEntries() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/slam");
      setEntries(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load gallery.");
    } finally {
      setLoading(false);
    }
  }

  async function likeEntry(id) {
    try {
      const { data } = await api.post(`/slam/${id}/like`);
      setEntries((current) => current.map((entry) => (entry._id === id ? data : entry)));
    } catch {
      setError("Could not like this entry right now.");
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
      <section className="mb-9 rounded-[2rem] bg-ink p-7 text-cream shadow-2xl">
        <p className="font-extrabold uppercase tracking-[0.28em] text-mango">Alumni Gallery</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">The passout memory wall</h1>
        <p className="mt-3 max-w-2xl text-cream/70">Browse submitted alumni cards with batch, department, college memories, farewell notes, current journeys, and advice for juniors.</p>
      </section>

      {loading && <LoadingSpinner label="Loading gallery" />}
      {error && <p className="rounded-2xl bg-coral/15 p-4 font-bold text-coral">{error}</p>}

      {!loading && !entries.length && (
        <div className="glass-card rounded-[2rem] p-10 text-center">
          <h2 className="font-display text-3xl font-bold">No entries yet</h2>
          <p className="mt-2 text-ink/65">Be the first alumni student to add a memory.</p>
        </div>
      )}

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <EntryCard key={entry._id} entry={entry} onLike={likeEntry} />
        ))}
      </motion.div>
    </main>
  );
}
