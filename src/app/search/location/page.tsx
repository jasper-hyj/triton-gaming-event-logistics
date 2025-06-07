'use client';
import BackHomeButton from '@/app/components/BackHomeButton';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import LocationsRepository, { Location } from '@/utils/supabase/repositories/LocationsRepository';
import useSession from '@/utils/supabase/use-session';
import { useEffect, useState } from 'react';
import LocationDetails from './components/LocationDetails';
import LocationSearchBar from './components/LocationSearchBar';


export default function LocationSearchPage() {
  const supabase = createSupabaseBrowserClient();

  const user = useSession()?.user

  // Initialize repositories
  const locationsRepo = new LocationsRepository(supabase);

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);


  // Ports, Parts lists for selects
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  // Load all ports and parts on mount for select options
  useEffect(() => {
    const fetchLocations = async () => {
      const locationsResult = await locationsRepo.getAll();
      if (!locationsResult.error && locationsResult.data) setAllLocations(locationsResult.data);

    };
    fetchLocations();
  }, [supabase]);

  const handleSearch = async (queryValue: string) => {
    const locationId = queryValue.trim();
    if (!locationId) return;
    setLoading(true);
    const { data, error } = await locationsRepo.getById(locationId);
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
            <LocationDetails
              location={location}
            />
          </>
        )}
      </div>
    </main>
  );
}