import { motion } from "framer-motion";
import { ExternalLink, GraduationCap, Heart, MapPin } from "lucide-react";
import { imageUrl } from "../services/api";

export default function EntryCard({ entry, onLike }) {
  return (
    <motion.article
      layout
      whileHover={{ y: -8, rotate: -0.4 }}
      className="group overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 shadow-xl shadow-ink/10 backdrop-blur-xl"
    >
      <div className="aspect-[4/3] overflow-hidden bg-cream">
        {entry.image ? (
          <img
            src={imageUrl(entry.image)}
            alt={entry.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-mango/60 to-coral/50 font-display text-5xl font-bold text-white">
            {entry.name?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">{entry.name}</h3>
          {entry.nickname && <p className="font-bold text-coral">aka {entry.nickname}</p>}
          {entry.collegeName && <p className="mt-2 text-sm font-extrabold text-ink/70">{entry.collegeName}</p>}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold text-ink/70">
            {entry.batchYear && (
              <span className="inline-flex items-center gap-1 rounded-full bg-mango/30 px-3 py-1">
                <GraduationCap size={14} />
                Batch {entry.batchYear}
              </span>
            )}
            {entry.department && <span className="rounded-full bg-lagoon/15 px-3 py-1">{entry.department}</span>}
          </div>
          {(entry.currentStatus || entry.currentCity) && (
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-ink/65">
              <MapPin size={15} className="text-coral" />
              {[entry.currentStatus, entry.currentCity].filter(Boolean).join(" - ")}
            </p>
          )}
        </div>

        {entry.memory && (
          <p className="rounded-3xl bg-cream/70 p-4 text-sm leading-6 text-ink/75">
            <span className="font-extrabold text-ink">College Memory: </span>
            {entry.memory}
          </p>
        )}

        {entry.message && <p className="text-sm leading-6 text-ink/75">{entry.message}</p>}

        {entry.adviceForJuniors && (
          <p className="rounded-3xl bg-white/60 p-4 text-sm leading-6 text-ink/70">
            <span className="font-extrabold text-ink">Advice for juniors: </span>
            {entry.adviceForJuniors}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLike?.(entry._id)}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-coral hover:text-white"
          >
            <Heart size={16} />
            {entry.likes || 0}
          </button>

          {entry.socialLink && (
            <a
              href={entry.socialLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-cream transition hover:bg-lagoon"
            >
              Connect
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
