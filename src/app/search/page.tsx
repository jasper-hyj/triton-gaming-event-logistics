"use client";

import { createClient } from "@/utils/supabase/client";
import ItemsRepository, {
  Item,
} from "@/utils/supabase/repositories/ItemsRepository";
import { useState } from "react";

export default function SearchPage() {
  const supabase = createClient();
  const repo = new ItemsRepository(supabase);

  const [query, setQuery] = useState("");
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
        setError("Item not found.");
      } else {
        setItem(data);
      }
    } catch (e) {
      setError("Error fetching item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-purple-700">
          Search for a Device
        </h1>

        <div className="flex gap-2 justify-center">
          <input
            className="w-full text-black max-w-md px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search by item ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {loading && <p className="text-blue-600 font-medium">Loading...</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {item && <ItemCard item={item} />}
      </div>
    </main>
  );
}

function ItemCard({ item }: { item: Item }) {
  return (
    <div className="bg-white border-4 border-purple-200 shadow-xl rounded-2xl p-6 mt-6 text-left">
      <h2 className="text-2xl font-bold text-purple-800 mb-1">{item.name}</h2>
      <p className="text-sm text-gray-500 mb-4 italic">{item.type}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
        <Field label="ID" value={item.id} />
        <Field label="Condition" value={item.condition} />
        <Field label="Provider" value={item.provider} />
        <Field label="Source" value={item.source} />
        <Field
          label="Installations"
          value={(item.installations || []).join(", ") || "—"}
        />

        <Field label="Password" value={item.password || "—"} />
        <Field
          label="Created"
          value={new Date(item.created_at).toLocaleString()}
        />
        <Field
          label="Description"
          value={item.description}
          className="md:col-span-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <TagGroup title="Ports" items={item.ports} color="bg-blue-100" />
        <TagGroup title="Parts" items={item.parts} color="bg-green-100" />
        <TagGroup title="Missing" items={item.missings} color="bg-red-100" />
      </div>

      {item.note && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded">
          <p className="font-semibold">Note:</p>
          <p>{item.note}</p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-semibold text-purple-600">{label}</p>
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
            <li key={i} className={`px-3 py-1 rounded-full ${color} text-sm`}>
              {item.id}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">None</p>
      )}
    </div>
  );
}
