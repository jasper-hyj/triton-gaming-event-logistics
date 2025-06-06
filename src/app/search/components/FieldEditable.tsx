export default function FieldEditable({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2 select-text">{label}</label>
      {readOnly ? (
        <p className="text-2xl min-h-[36px] text-gray-900 whitespace-pre-wrap">{value || '—'}</p>
      ) : textarea ? (
        <textarea
          className="resize-y min-h-[72px] max-h-48 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 placeholder-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          spellCheck={false}
        />
      ) : (
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 placeholder-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type="text"
          spellCheck={false}
        />
      )}
    </div>
  );
}

