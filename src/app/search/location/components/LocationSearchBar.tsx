import { Location } from "@/utils/supabase/repositories/LocationsRepository";

type LocationSearchBarProps = {
    query: string;
    setQuery: (id: string) => void;
    allLocations: Location[];
    loading: boolean;
    handleSearch: () => Promise<void>;
};


export default function LocationSearchBar({
    query,
    setQuery,
    allLocations,
    loading,
    handleSearch
}: LocationSearchBarProps
) {
    return (<>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Search for a Location</h1>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <select
                    value={query}
                    disabled={loading}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full max-w-lg px-5 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                    <option value="" disabled >-- Select Location --</option>
                    {allLocations.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.id}
                        </option>
                    ))}
                </select>
            <button
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm sm:text-base"
                onClick={handleSearch}
                disabled={loading}
            >
                🔍 Search
            </button>
        </div>
    </>)
}