export default function Field({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="font-semibold text-gray-600">{label}</p>
      <p>{value || '—'}</p>
    </div>
  );
}

