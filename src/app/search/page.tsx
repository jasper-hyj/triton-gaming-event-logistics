'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ItemsRepository, { Item } from '@/utils/supabase/repositories/ItemsRepository';
import PartsRepository, { Part } from '@/utils/supabase/repositories/PartsRepository';
import { useState, useEffect } from 'react';
import PortsRepository, { Port } from '@/utils/supabase/repositories/PortsRepository';
import ItemDetails from './components/ItemDetails';
import ItemSearchBar from './components/ItemSearchBar';
import InstallationsRepository, { Installation } from '@/utils/supabase/repositories/InstallationsRepository';


export default function SearchPage() {
  const router = useRouter();
  const supabase = createClient();

  // Initialize repositories
  const installationsRepo = new InstallationsRepository(supabase);
  const itemsRepo = new ItemsRepository(supabase);
  const partsRepo = new PartsRepository(supabase);
  const portsRepo = new PortsRepository(supabase);

  const [query, setQuery] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Ports, Parts lists for selects
  const [allInstallations, setAllInstallations] = useState<Installation[]>([]);
  const [allPorts, setAllPorts] = useState<Port[]>([]);
  const [allParts, setAllParts] = useState<Part[]>([]);

  // Load all ports and parts on mount for select options
  useEffect(() => {
    const fetchPortsAndParts = async () => {
      const portsResult = await portsRepo.getAll();
      if (!portsResult.error && portsResult.data) setAllPorts(portsResult.data);

      const partsResult = await partsRepo.getAll();
      if (!partsResult.error && partsResult.data) setAllParts(partsResult.data);

      const installationsResult = await installationsRepo.getAll();
      if (!installationsResult.error && installationsResult.data) setAllInstallations(installationsResult.data);
    };
    fetchPortsAndParts();
  }, [supabase]);


  const handleSearch = async () => {
    const itemId = query.trim().replaceAll(" ", "")
    if (!itemId) return;
    setLoading(true);
    setError(null);
    setItem(null);
    setEditMode(false);

    try {
      const { data, error } = await itemsRepo.getById(itemId);
      if (error || !data) {
        setError('Item not found.');
      } else {
        setItem(data);
        setEditedItem({
          name: data.name,
          type: data.type,
          condition: data.condition,
          provider: data.provider,
          source: data.source,
          password: data.password,
          note: data.note,
          description: data.description,
        });
      }
    } catch (e) {
      setError('Error fetching item.');
    } finally {
      setLoading(false);
    }
  };

  // Handle field changes
  const onChangeField = (field: keyof typeof editedItem, value: string | string[]) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  // Handle multi-select for ports and parts
  // For simplicity, we'll store selected port ids and part ids separately here
  const [selectedInstallations, setSelectedInstallations] = useState<Set<string>>(new Set());
  const [selectedPorts, setSelectedPorts] = useState<Set<string>>(new Set());
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());
  const [selectedMissings, setSelectedMissings] = useState<Set<string>>(new Set());

  // When item loads, update selections
  useEffect(() => {
    if (item) {
      setSelectedInstallations(new Set(item.installations.map((p) => p.id)));
      setSelectedPorts(new Set(item.ports.map((p) => p.id)));
      setSelectedParts(new Set(item.parts.map((p) => p.id)));
      setSelectedMissings(new Set(item.missings.map((p) => p.id)));
    } else {
      setSelectedInstallations(new Set());
      setSelectedPorts(new Set());
      setSelectedParts(new Set());
      setSelectedMissings(new Set());
    }
  }, [item]);

  const toggleSelection = (id: string, set: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    set((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!item) return;
    setLoading(true);
    setError(null);

    try {
      // Update main item fields
      const { error: updateError } = await itemsRepo.update(item.id, editedItem);
      if (updateError) throw updateError;

      await itemsRepo.unlinkItemFromAllInstallation(item.id);
      await itemsRepo.unlinkItemFromAllPort(item.id);
      await itemsRepo.unlinkItemFromAllPart(item.id);
      await itemsRepo.unlinkItemFromAllMissing(item.id);

      
      await itemsRepo.linkItemToAllInstallation(item.id, selectedInstallations);
      await itemsRepo.linkItemToAllPort(item.id, selectedPorts);
      await itemsRepo.linkItemToAllPart(item.id, selectedParts);
      await itemsRepo.linkItemToAllMissing(item.id, selectedMissings);

      // Reload updated item
      const { data, error: reloadError } = await itemsRepo.getById(item.id);
      if (reloadError || !data) throw reloadError || new Error('Failed to reload item');

      setItem(data);
      setEditMode(false);
    } catch (e) {
      setError('Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">
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

        <ItemSearchBar
          query={query}
          setQuery={setQuery}
          loading={loading}
          handleSearch={handleSearch}
        />
        {loading && <p className="text-blue-500 font-medium">Loading...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        {item && (
          <>
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-3xl font-semibold text-gray-800 pl-1">{item.id}</h2>
              <button
                onClick={() => {
                  if (editMode) handleSave();
                  else setEditMode(true);
                }}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {editMode ? (loading ? 'Saving...' : 'Save Changes') : 'Edit Item'}
              </button>
            </div>

            <ItemDetails
              item={item}
              editedItem={editedItem}
              onChangeField={onChangeField}
              editMode={editMode}
              allInstallations={allInstallations}
              allPorts={allPorts}
              allParts={allParts}
              selectedInstallations={selectedInstallations}
              toggleSelectedInstallations={(id) => toggleSelection(id, setSelectedInstallations)}
              selectedPorts={selectedPorts}
              toggleSelectedPort={(id) => toggleSelection(id, setSelectedPorts)}
              selectedParts={selectedParts}
              toggleSelectedPart={(id) => toggleSelection(id, setSelectedParts)}
              selectedMissings={selectedMissings}
              toggleSelectedMissing={(id) => toggleSelection(id, setSelectedMissings)}
            />
          </>
        )}
      </div>
    </main>
  );
}