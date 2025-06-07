import { Location } from "@/lib/repositories/LocationsRepository";
import FormComponent from "../../components/FormComponent";

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
  handleSearch,
}: LocationSearchBarProps) {
  const formComponent = new FormComponent();
  const handleChange = async (value: string) => {
    setQuery(value); // Update state
    await handleSearch(value); // Use the latest value
  };
  return (
    <>
      <formComponent.Dropdown
        label="Location"
        value={query}
        options={allLocations}
        onChange={handleChange}
        readOnly={loading}
      />
    </>
  );
}
