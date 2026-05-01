export default function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-cream p-6 shadow-2xl">
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-full bg-white px-5 py-3 font-bold text-ink">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-full bg-coral px-5 py-3 font-bold text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
