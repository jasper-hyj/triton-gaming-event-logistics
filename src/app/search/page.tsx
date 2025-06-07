"use client";

import { useMemo, useState } from "react";
import BackHomeButton from "../components/BackHomeButton";
import ItemDetails from "./components/ItemDetails";
import ItemSearchBar from "./components/ItemSearchBar";
import ItemsRepository, { Item } from "@/lib/repositories/ItemsRepository";
import TypesRepository from "@/lib/repositories/TypesRepository";
import ConditionsRepository from "@/lib/repositories/ConditionsRepository";
import SourcesRepository from "@/lib/repositories/SourcesRepository";
import InstallationsRepository from "@/lib/repositories/InstallationsRepository";
import PortsRepository from "@/lib/repositories/PortsRepository";
import PartsRepository from "@/lib/repositories/PartsRepository";
import { useFetch } from "@/hooks/useFetch";
import useUserClient from "@/hooks/useUserClient";

// Hook for fetching static list data

export default function SearchPage() {
  const { data: user } = useUserClient();
  const itemsRepo = useMemo(() => new ItemsRepository(), []);
  const types = useFetch(() => new TypesRepository().getAll(), []);
  const conditions = useFetch(() => new ConditionsRepository().getAll(), []);
  const sources = useFetch(() => new SourcesRepository().getAll(), []);
  const installations = useFetch(
    () => new InstallationsRepository().getAll(),
    [],
  );
  const ports = useFetch(() => new PortsRepository().getAll(), []);
  const parts = useFetch(() => new PartsRepository().getAll(), []);

  const [query, setQuery] = useState("");
  const [item, setItem] = useState<Item | null>(null);
  const [edited, setEdited] = useState({});
  const [status, setStatus] = useState<{
    loading: boolean;
    error: string | null;
    editMode: boolean;
  }>({
    loading: false,
    error: null,
    editMode: false,
  });

  const [selection, setSelection] = useState({
    installations: new Set<string>(),
    ports: new Set<string>(),
    parts: new Set<string>(),
    missings: new Set<string>(),
  });

  const updateSelection = (key: keyof typeof selection, id: string) => {
    setSelection((prev) => {
      const set = new Set(prev[key]);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return { ...prev, [key]: set };
    });
  };

  const handleSearch = async () => {
    const id = query.trim().replaceAll(" ", "").toUpperCase();
    if (!id) return;

    setStatus({ loading: true, error: null, editMode: false });
    setItem(null);

    const { data, error } = await itemsRepo.getById(id);
    if (error || !data) {
      setStatus((prev) => ({
        ...prev,
        error: "Item not found.",
        loading: false,
      }));
      return;
    }

    setItem(data);
    setEdited({
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

    setSelection({
      installations: new Set(data.installations.map((p) => p.id)),
      ports: new Set(data.ports.map((p) => p.id)),
      parts: new Set(data.parts.map((p) => p.id)),
      missings: new Set(data.missings.map((p) => p.id)),
    });

    setStatus((prev) => ({ ...prev, loading: false }));
  };

  const handleCreateNew = async () => {
    const id = query.trim().replaceAll(" ", "").toUpperCase();
    if (!id) return;

    setStatus({ loading: true, error: null, editMode: true });

    const newItem = {
      id,
      name: null,
      type: null,
      condition: null,
      provider: null,
      source: null,
      password: null,
      note: null,
      description: null,
    };

    const { error } = await itemsRepo.insert(newItem);
    if (error) {
      setStatus({
        loading: false,
        error: "Failed to create new item.",
        editMode: false,
      });
      return;
    }

    const { data } = await itemsRepo.getById(id);
    setItem(data);
    setEdited(newItem);
    setStatus({ loading: false, error: null, editMode: true });
  };

  const handleSave = async () => {
    if (!item) return;
    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      await itemsRepo.update(item.id, edited);

      await Promise.all([
        itemsRepo.unlinkItemFromAllInstallation(item.id),
        itemsRepo.unlinkItemFromAllPort(item.id),
        itemsRepo.unlinkItemFromAllPart(item.id),
        itemsRepo.unlinkItemFromAllMissing(item.id),
      ]);

      await Promise.all([
        itemsRepo.linkItemToAllInstallation(item.id, selection.installations),
        itemsRepo.linkItemToAllPort(item.id, selection.ports),
        itemsRepo.linkItemToAllPart(item.id, selection.parts),
        itemsRepo.linkItemToAllMissing(item.id, selection.missings),
      ]);

      const { data } = await itemsRepo.getById(item.id);
      setItem(data);
      setStatus({ loading: false, error: null, editMode: false });
    } catch {
      setStatus({
        loading: false,
        error: "Failed to save changes.",
        editMode: true,
      });
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">
      <BackHomeButton />

      <div className="text-center space-y-8">
        <ItemSearchBar
          query={query}
          setQuery={setQuery}
          loading={status.loading}
          handleSearch={handleSearch}
        />

        {status.loading && (
          <p className="text-blue-500 font-medium">Loading...</p>
        )}
        {status.error === "Item not found." ? (
          <div>
            <p className="text-red-500">{status.error}</p>
            <button
              onClick={handleCreateNew}
              disabled={status.loading}
              className="btn-green"
            >
              {status.loading
                ? "Creating..."
                : `Create New Item "${query.trim()}"`}
            </button>
          </div>
        ) : (
          status.error && <p className="text-red-500">{status.error}</p>
        )}

        {item && (
          <>
            {user && (
              <div className="flex justify-between items-center mt-6">
                <h2 className="text-3xl font-semibold text-gray-800 pl-1">
                  {item.id}
                </h2>
                <button
                  onClick={() =>
                    status.editMode
                      ? handleSave()
                      : setStatus({
                          ...status,
                          editMode: true,
                        })
                  }
                  className="btn-blue"
                >
                  {status.editMode
                    ? status.loading
                      ? "Saving..."
                      : "Save Changes"
                    : "Edit Item"}
                </button>
              </div>
            )}
            <ItemDetails
              item={item}
              editedItem={edited}
              onChangeField={(f, v) =>
                setEdited((prev) => ({ ...prev, [f]: v }))
              }
              editMode={status.editMode}
              allTypes={types.data}
              allConditions={conditions.data}
              allSources={sources.data}
              allInstallations={installations.data}
              allPorts={ports.data}
              allParts={parts.data}
              selectedInstallations={selection.installations}
              toggleSelectedInstallations={(id) =>
                updateSelection("installations", id)
              }
              selectedPorts={selection.ports}
              toggleSelectedPort={(id) => updateSelection("ports", id)}
              selectedParts={selection.parts}
              toggleSelectedPart={(id) => updateSelection("parts", id)}
              selectedMissings={selection.missings}
              toggleSelectedMissing={(id) => updateSelection("missings", id)}
            />
          </>
        )}
      </div>
    </main>
  );
}
