import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, GraduationCap, Send, Stars } from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const gratitudeMessages = [
  {
    title: "Thank you for carrying VSBM forward",
    text: "Your discipline, curiosity, and achievements have added pride to our college family."
  },
  {
    title: "You will always belong here",
    text: "The classrooms, corridors, labs, and friendships you built here will remain part of your story."
  },
  {
    title: "Go ahead with courage",
    text: "May your next chapter bring success, service, good character, and meaningful impact."
  }
];

const initialForm = {
  name: "",
  nickname: "",
  batchYear: "",
  department: "",
  rollNumber: "",
  currentStatus: "",
  currentCity: "",
  socialLink: "",
  memory: "",
  message: "",
  futureGoals: "",
  favoriteTeacher: "",
  achievements: "",
  adviceForJuniors: "",
  image: null
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (form.name.trim().length === 1) nextErrors.name = "Name must be at least 2 characters.";
    if (!form.collegeName.trim()) nextErrors.collegeName = "College name is required.";
    if (!form.batchYear.trim()) nextErrors.batchYear = "Batch or passout year is required.";
    if (!form.department.trim()) nextErrors.department = "Department or course is required.";
    if (form.socialLink && !/^https?:\/\/.+\..+/.test(form.socialLink.trim())) {
      nextErrors.socialLink = "Enter a valid link starting with http:// or https://.";
    }
    if (form.image && form.image.size > 5 * 1024 * 1024) {
      nextErrors.image = "Photo must be under 5MB.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) return;

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    setLoading(true);
    try {
      await api.post("/slam", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(initialForm);
      event.target.reset();
      setStatus({ type: "success", message: "Your alumni memory is saved. This batch wall just got more special." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Could not save your entry. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-7"
      >
        <div className="glass-card overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-xl shadow-ink/10">
              <img
                src="/vsbm-logo.png"
                alt="VSBM College logo"
                className="h-20 w-auto object-contain sm:h-24"
              />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-coral">VSBM Alumni Memories</p>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-ink">
                With gratitude to our passout students
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/68">
                This digital slam book is a tribute to every student who has completed their journey with us and stepped into the world as a proud representative of our college.
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-2 text-sm font-extrabold text-ink/75 backdrop-blur-xl">
          <Stars size={18} className="text-coral" />
          Alumni memories, college stories, future paths
        </div>

        <div className="space-y-5">
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-ink sm:text-7xl">
            A digital farewell book for our beloved passout students.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-ink/72">
            Collect batch details, departments, college memories, farewell messages, photos, goals, achievements, and advice for juniors in one beautiful alumni keepsake.
          </p>
        </div>

        <div className="grid gap-4">
          {gratitudeMessages.map((message, index) => (
            <motion.article
              key={message.title}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.12 * index }}
              className="rounded-[1.6rem] border border-white/60 bg-white/45 p-5 shadow-lg shadow-ink/5 backdrop-blur-xl"
            >
              <p className="font-display text-lg font-bold text-ink">{message.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink/68">{message.text}</p>
            </motion.article>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[2rem] bg-ink p-3 text-cream shadow-2xl">
          {["Batches", "Memories", "Alumni"].map((item) => (
            <div key={item} className="rounded-[1.4rem] bg-white/10 p-4 text-center">
              <p className="font-display text-lg font-bold">{item}</p>
              <p className="mt-1 text-xs text-cream/65">saved</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="glass-card rounded-[2.25rem] p-5 sm:p-8"
      >
        <div className="mb-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-coral">Passout Slam Book</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Leave your college legacy</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Name *</span>
              <input className="field" name="name" value={form.name} onChange={updateField} placeholder="Aarav Sharma" />
              {errors.name && <p className="text-sm font-bold text-coral">{errors.name}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Nickname</span>
              <input className="field" name="nickname" value={form.nickname} onChange={updateField} placeholder="Rocket" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">College Name *</span>
              <input className="field" name="collegeName" value={form.collegeName} onChange={updateField} placeholder="ABC College of Science" />
              {errors.collegeName && <p className="text-sm font-bold text-coral">{errors.collegeName}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Batch / Passout Year *</span>
              <input className="field" name="batchYear" value={form.batchYear} onChange={updateField} placeholder="2022-2026" />
              {errors.batchYear && <p className="text-sm font-bold text-coral">{errors.batchYear}</p>}
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Department / Course *</span>
              <input className="field" name="department" value={form.department} onChange={updateField} placeholder="B.Sc Computer Science" />
              {errors.department && <p className="text-sm font-bold text-coral">{errors.department}</p>}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Roll Number</span>
              <input className="field" name="rollNumber" value={form.rollNumber} onChange={updateField} placeholder="CS-104" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Current Status</span>
              <input className="field" name="currentStatus" value={form.currentStatus} onChange={updateField} placeholder="Placed at TCS / Higher studies" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">Current City</span>
              <input className="field" name="currentCity" value={form.currentCity} onChange={updateField} placeholder="Bengaluru" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-extrabold text-ink">LinkedIn / Social Link</span>
              <input className="field" name="socialLink" value={form.socialLink} onChange={updateField} placeholder="https://linkedin.com/in/..." />
              {errors.socialLink && <p className="text-sm font-bold text-coral">{errors.socialLink}</p>}
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-extrabold text-ink">Best College Memory</span>
            <textarea className="field min-h-28" name="memory" value={form.memory} onChange={updateField} placeholder="That one fest, lab practical, trip, canteen moment, or annual day nobody forgot..." />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-extrabold text-ink">Farewell Message for Friends and College</span>
            <textarea className="field min-h-28" name="message" value={form.message} onChange={updateField} placeholder="Write something warm, funny, grateful, or legendary." />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm font-extrabold text-ink">Future Goals</span>
            <textarea className="field min-h-24" name="futureGoals" value={form.futureGoals} onChange={updateField} placeholder="Job, startup, higher studies, government exam, dream company..." />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 block">
              <span className="text-sm font-extrabold text-ink">Favorite Teacher / Mentor</span>
              <input className="field" name="favoriteTeacher" value={form.favoriteTeacher} onChange={updateField} placeholder="Prof. Sharma" />
            </label>

            <label className="space-y-2 block">
              <span className="text-sm font-extrabold text-ink">Achievements / Proud Moment</span>
              <input className="field" name="achievements" value={form.achievements} onChange={updateField} placeholder="Won hackathon, cultural secretary, top rank..." />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-extrabold text-ink">Advice for Juniors</span>
            <textarea className="field min-h-24" name="adviceForJuniors" value={form.adviceForJuniors} onChange={updateField} placeholder="One thing juniors should never miss during college life..." />
          </label>

          <label className="block rounded-[1.5rem] border border-dashed border-ink/25 bg-white/45 p-5 text-center transition hover:bg-white/65">
            <div className="mx-auto mb-2 flex w-fit gap-2 text-coral">
              <Camera />
              <GraduationCap />
            </div>
            <span className="block font-extrabold text-ink">Upload Graduation / College Photo</span>
            <span className="text-sm text-ink/60">{form.image ? form.image.name : "PNG, JPG, or WEBP under 5MB"}</span>
            <input className="sr-only" type="file" name="image" accept="image/*" onChange={updateField} />
          </label>
          {errors.image && <p className="text-sm font-bold text-coral">{errors.image}</p>}

          {status.message && (
            <p className={`rounded-2xl p-4 text-sm font-bold ${status.type === "success" ? "bg-lagoon/15 text-lagoon" : "bg-coral/15 text-coral"}`}>
              {status.message}
            </p>
          )}

          <button disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 px-6 py-4 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <LoadingSpinner label="Saving" /> : <><Send size={18} /> Add to Alumni Wall</>}
          </button>
        </form>
      </motion.section>
    </main>
  );
}
