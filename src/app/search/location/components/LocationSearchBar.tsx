import { Location } from "@/utils/supabase/repositories/LocationsRepository";
import FieldDropdown from "../../components/FieldDropdown";

type LocationSearchBarProps = {
    query: string;
    setQuery: (id: string) => void;
    allLocations: Location[];
    loading: boolean;
    handleSearch: (value: string) => Promise<void>;
};


export default function LocationSearchBar({
    query,
    setQuery,
    allLocations,
    loading,
    handleSearch
}: LocationSearchBarProps
) {
    const handleChange = async (value: string) => {
        setQuery(value);           // Update state
        await handleSearch(value); // Use the latest value
    };
    return (<>
        <FieldDropdown
            label="Location"
            value={query}
            options={allLocations}
            onChange={handleChange}
            readOnly={loading}
        />
    </>)
}