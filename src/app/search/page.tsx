'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ItemsRepository, { Item } from '@/utils/supabase/repositories/ItemsRepository';
import { useState } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const supabase = createClient();
  const repo = new ItemsRepository(supabase);

  const [query, setQuery] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setItem(null);

    try {
      const { data, error } = await repo.getItemById(query.trim());
      if (error || !data) {
        setError('Item not found.');
      } else {
        setItem(data);
      }
    } catch (e) {
      setError('Error fetching item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-4xl mx-auto">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-8 inline-flex items-center text-gray-600 hover:text-blue-600 transition"
        aria-label="Back to home"
      >
        <svg
          className="w-5 h-5 mr-1 stroke-current"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
        Home
      </button>

      <div className="text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Search for a Device
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input
            className="w-full sm:w-auto max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Search by item ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {loading && <p className="text-blue-500 font-medium">Loading...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        {item && <ItemCard item={item} />}
      </div>
    </main>
  );
}

function ItemCard({ item }: { item: Item }) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mt-10 text-left">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">{item.name}</h2>
      <p className="text-sm text-gray-500 mb-4 italic">{item.type}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <Field label="ID" value={item.id} />
        <Field label="Condition" value={item.condition} />
        <Field label="Provider" value={item.provider} />
        <Field label="Source" value={item.source} />
        <Field label="Installations" value={(item.installations || []).join(', ') || '—'} />
        <Field label="Password" value={item.password || '—'} />
        <Field label="Created" value={new Date(item.created_at).toLocaleString()} />
        <Field label="Description" value={item.description} className="sm:col-span-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <TagGroup title="Ports" items={item.ports} color="bg-blue-100" />
        <TagGroup title="Parts" items={item.parts} color="bg-green-100" />
        <TagGroup title="Missing" items={item.missings} color="bg-red-100" />
      </div>

      {item.note && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          <p className="font-medium">Note:</p>
          <p>{item.note}</p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-semibold text-gray-600">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function TagGroup({
  title,
  items,
  color,
}: {
  title: string;
  items: { id: string }[];
  color: string;
}) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      {items.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <li
              key={i}
              className={`px-3 py-1 rounded-full ${color} text-sm text-gray-800`}
            >
              {item.id}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">None</p>
      )}
    </div>
  );
}
