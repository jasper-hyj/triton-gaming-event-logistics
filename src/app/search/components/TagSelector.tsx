export default function TagSelector<T extends { id: string }>({
  title,
  allItems,
  selectedIds,
  toggleSelected,
  disabled,
  color,
}: {
  title: string;
  allItems: T[];
  selectedIds: Set<string>;
  toggleSelected: (id: string) => void;
  disabled: boolean;
  color: string;
}) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      {allItems.length === 0 ? (
        <p className="text-gray-400 italic">No options</p>
      ) : (
        <ul className={`min-h-[46px] flex flex-wrap gap-2 max-h-48 overflow-y-auto 
          ${disabled ? '' : 'border border-gray-200'} rounded p-2 bg-white`}>
          {allItems.map(({ id }) => {
            const selected = selectedIds.has(id);
            return (
              <li
                key={id}
                onClick={() => !disabled && toggleSelected(id)}
                className={`cursor-pointer select-none px-3 py-1 rounded-full text-sm font-medium
                  ${selected ? `${color} text-gray-900` : 'bg-gray-100 text-gray-500'}
                  ${disabled ? 'cursor-default' : 'hover:bg-gray-200'}
                  ${(!selected) && disabled ? 'hidden' : ''}`}
                title={id}
                aria-pressed={selected}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    toggleSelected(id);
                  }
                }}
              >
                {id}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
