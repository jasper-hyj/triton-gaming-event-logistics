"use client";
import ConditionsRepository, { Condition } from "@/lib/repositories/ConditionsRepository";
import InstallationsRepository, { Installation } from "@/lib/repositories/InstallationsRepository";
import ItemsRepository, { Item } from "@/lib/repositories/ItemsRepository";
import PartsRepository, { Part } from "@/lib/repositories/PartsRepository";
import PortsRepository, { Port } from "@/lib/repositories/PortsRepository";
import SourcesRepository, { Source } from "@/lib/repositories/SourcesRepository";
import TypesRepository, { Type } from "@/lib/repositories/TypesRepository";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ItemDetails from "./components/ItemDetails";
import ItemSearchBar from "./components/ItemSearchBar";
import { ROLE_LEVELS } from "@/lib/auth/Role";
import { useUser } from "../login/UserContext";

export default function SearchPage() {
  const router = useRouter();
  const { user } = useUser();

  // Initialize repositories
  const typesRepo = new TypesRepository();
  const conditionsRepo = new ConditionsRepository();
  const sourcesRepo = new SourcesRepository();
  const installationsRepo = new InstallationsRepository();
  const itemsRepo = new ItemsRepository();
  const partsRepo = new PartsRepository();
  const portsRepo = new PortsRepository();

  const [query, setQuery] = useState("");
  const [item, setItem] = useState<Item | null>(null);

  const [editedItem, setEditedItem] = useState<Partial<Omit<Item, "ports" | "parts" | "missings">>>(
    {},
  );
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
      if (!installationsResult.error && installationsResult.data)
        setAllInstallations(installationsResult.data);

      const portsResult = await portsRepo.getAll();
      if (!portsResult.error && portsResult.data) setAllPorts(portsResult.data);

      const partsResult = await partsRepo.getAll();
      if (!partsResult.error && partsResult.data) setAllParts(partsResult.data);
    };
    fetchPortsAndParts();
  });

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
        setError("Item not found.");
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
        id: query.trim().replaceAll(" ", "").toUpperCase(),
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
        setError("Failed to create new item.");
        return;
      }

      const { data } = await itemsRepo.getById(newItemData.id);
      setItem(data);
      setEditedItem(newItemData);
      setEditMode(true);
      setError(null);
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
      const { data, error: reloadError } = await itemsRepo.getById(
        editedItem.id ? editedItem.id : item.id,
      );
      if (reloadError || !data) throw reloadError || new Error("Failed to reload item");

      setItem(data);
      setEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">
      <button
        onClick={() => router.push("/")}
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
        {error === "Item not found." && user && user.roleLevel >= ROLE_LEVELS.tg_elo ? (
          <div className="text-center">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <button
              onClick={handleCreateNew}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              {loading ? "Creating..." : `Create New Item "${query.trim()}"`}
            </button>
          </div>
        ) : (
          error && <p className="text-red-500 font-medium">{error}</p>
        )}

        {item && (
          <>
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-3xl font-semibold text-gray-800 pl-1">{item.id}</h2>
              {user && user.roleLevel >= ROLE_LEVELS.tg_officer && (
                <button
                  onClick={() => {
                    if (editMode) handleSave();
                    else setEditMode(true);
                  }}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  {editMode ? (loading ? "Saving..." : "Save Changes") : "Edit Item"}
                </button>
              )}
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
