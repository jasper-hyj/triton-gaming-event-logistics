"use client";
import BackHomeButton from "@/app/components/BackHomeButton";
import LocationsRepository, {
  Location,
} from "@/lib/repositories/LocationsRepository";
import { useState } from "react";
import LocationDetails from "./components/LocationDetails";
import LocationSearchBar from "./components/LocationSearchBar";

export default function LocationSearchPage() {
  // Initialize repositories
  const locationsRepo = new LocationsRepository();

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);

  // Ports, Parts lists for selects
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  // Load all ports and parts on mount for select options
  const fetchLocations = async () => {
    const locationsResult = await locationsRepo.getAll();
    if (!locationsResult.error && locationsResult.data)
      setAllLocations(locationsResult.data);
  };
  fetchLocations();

  const handleSearch = async (queryValue: string) => {
    const locationId = queryValue.trim();
    if (!locationId) return;
    setLoading(true);
    const { data } = await locationsRepo.getById(locationId);
    setLocation(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">
      <BackHomeButton />
      <div className="space-y-8">
        <LocationSearchBar
          query={query}
          loading={loading}
          setQuery={setQuery}
          handleSearch={handleSearch}
          allLocations={allLocations}
        />
        {location && (
          <>
            <LocationDetails location={location} />
          </>
        )}
      </div>
    </main>
  );
}
