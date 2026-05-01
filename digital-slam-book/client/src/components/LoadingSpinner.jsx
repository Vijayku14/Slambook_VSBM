export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-sm font-bold text-ink/70">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-coral" />
      <span>{label}</span>
    </div>
  );
}
