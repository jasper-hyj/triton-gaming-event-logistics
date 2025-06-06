'use client';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import ItemsRepository, { Item } from '@/utils/supabase/repositories/ItemsRepository';
import PartsRepository, { Part } from '@/utils/supabase/repositories/PartsRepository';
import { useState, useEffect } from 'react';
import PortsRepository, { Port } from '@/utils/supabase/repositories/PortsRepository';
import ItemDetails from './components/ItemDetails';
import ItemSearchBar from './components/ItemSearchBar';
import InstallationsRepository, { Installation } from '@/utils/supabase/repositories/InstallationsRepository';
import TypesRepository, { Type } from '@/utils/supabase/repositories/TypesRepository';
import ConditionsRepository, { Condition } from '@/utils/supabase/repositories/ConditionsRepository';
import SourcesRepository, { Source } from '@/utils/supabase/repositories/SourcesRepository';
import BackHomeButton from '../components/BackHomeButton';
import useSession from '@/utils/supabase/use-session';


export default function SearchPage() {
  const supabase = createSupabaseBrowserClient();

  const user = useSession()?.user

  // Initialize repositories
  const typesRepo = new TypesRepository(supabase);
  const conditionsRepo = new ConditionsRepository(supabase);
  const sourcesRepo = new SourcesRepository(supabase);
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
  const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [allConditions, setAllConditions] = useState<Condition[]>([]);
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [allInstallations, setAllInstallations] = useState<Installation[]>([]);
  const [allPorts, setAllPorts] = useState<Port[]>([]);
  const [allParts, setAllParts] = useState<Part[]>([]);

  // Load all ports and parts on mount for select options
  useEffect(() => {
    const fetchPortsAndParts = async () => {
      const typesResult = await typesRepo.getAll();
      if (!typesResult.error && typesResult.data) setAllTypes(typesResult.data);

      const conditionsResult = await conditionsRepo.getAll();
      if (!conditionsResult.error && conditionsResult.data) setAllConditions(conditionsResult.data);

      const sourcesResult = await sourcesRepo.getAll();
      if (!sourcesResult.error && sourcesResult.data) setAllSources(sourcesResult.data);

      const installationsResult = await installationsRepo.getAll();
      if (!installationsResult.error && installationsResult.data) setAllInstallations(installationsResult.data);

      const portsResult = await portsRepo.getAll();
      if (!portsResult.error && portsResult.data) setAllPorts(portsResult.data);

      const partsResult = await partsRepo.getAll();
      if (!partsResult.error && partsResult.data) setAllParts(partsResult.data);
    };
    fetchPortsAndParts();
  }, [supabase]);


  const handleSearch = async () => {
    const itemId = query.trim().replaceAll(" ", "").toUpperCase();
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
          id: data.id,
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

  const handleCreateNew = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Create a new item with minimal default fields, using query as id
      const newItemData = {
        id: query.trim().replaceAll(' ', '').toUpperCase(),
        name: null,
        type: null,
        description: null,
        password: null,
        condition: null,
        source: null,
        provider: null,
        note: null,
      };

      const { error: createError } = await itemsRepo.insert(newItemData);
      if (createError) {
        setError('Failed to create new item.');
        return;
      }

      const { data, error } = await itemsRepo.getById(newItemData.id);
      setItem(data);
      setEditedItem(newItemData);
      setEditMode(true);
      setError(null);
    } catch (e) {
      setError('Failed to create new item.');
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
      const { data, error: reloadError } = await itemsRepo.getById((editedItem.id) ? editedItem.id : item.id);
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
      <BackHomeButton />

      <div className="text-center space-y-8">

        <ItemSearchBar
          query={query}
          setQuery={setQuery}
          loading={loading}
          handleSearch={handleSearch}
        />
        {loading && <p className="text-blue-500 font-medium">Loading...</p>}
        {error === 'Item not found.' ? (
          <div className="text-center">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <button
              onClick={handleCreateNew}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              {loading ? 'Creating...' : `Create New Item "${query.trim()}"`}
            </button>
          </div>
        ) : (
          error && <p className="text-red-500 font-medium">{error}</p>
        )}

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
              allTypes={allTypes}
              allConditions={allConditions}
              allSources={allSources}
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