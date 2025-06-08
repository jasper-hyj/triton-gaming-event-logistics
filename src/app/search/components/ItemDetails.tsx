import { Item } from "@/lib/repositories/ItemsRepository";
import { Part } from "@/lib/repositories/PartsRepository";
import { Port } from "@/lib/repositories/PortsRepository";
import { Installation } from "@/lib/repositories/InstallationsRepository";
import TagSelector from "./TagSelector";
import { Type } from "@/lib/repositories/TypesRepository";
import { Condition } from "@/lib/repositories/ConditionsRepository";
import { Source } from "@/lib/repositories/SourcesRepository";
import FormComponent from "./FormComponent";
import QRCodeStyled from "@/app/components/QRCodeGenerator";

type ItemDetailsProps = {
  item: Item;
  editedItem: Partial<Omit<Item, "ports" | "parts" | "missings">>;
  onChangeField: (
    field: keyof Partial<Omit<Item, "ports" | "parts" | "missings">>,
    value: string | string[],
  ) => void;
  editMode: boolean;

  allTypes: Type[];
  allConditions: Condition[];
  allSources: Source[];
  allInstallations: Installation[];
  allPorts: Port[];
  allParts: Part[];

  selectedInstallations: Set<string>;
  toggleSelectedInstallations: (id: string) => void;
  selectedPorts: Set<string>;
  toggleSelectedPort: (id: string) => void;

  selectedParts: Set<string>;
  toggleSelectedPart: (id: string) => void;

  selectedMissings: Set<string>;
  toggleSelectedMissing: (id: string) => void;
};

export default function ItemDetails({
  item,
  editedItem,
  onChangeField,
  editMode,
  allTypes,
  allConditions,
  allSources,
  allInstallations,
  allPorts,
  allParts,
  selectedInstallations,
  toggleSelectedInstallations,
  selectedPorts,
  toggleSelectedPort,
  selectedParts,
  toggleSelectedPart,
  selectedMissings,
  toggleSelectedMissing,
}: ItemDetailsProps) {
  const formComponent = new FormComponent();
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mt-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <formComponent.Editable
          label="Id"
          value={editedItem.id ?? ""}
          onChange={(v) => onChangeField("id", v)}
          readOnly={!editMode}
        />
        <formComponent.Editable
          label="Name"
          value={editedItem.name ?? ""}
          onChange={(v) => onChangeField("name", v)}
          readOnly={!editMode}
        />
        <formComponent.Dropdown
          label="Type"
          value={editedItem.type ?? ""}
          options={allTypes}
          onChange={(v) => onChangeField("type", v)}
          readOnly={!editMode}
        />
        <formComponent.Dropdown
          label="Condition"
          value={editedItem.condition ?? ""}
          options={allConditions}
          onChange={(v) => onChangeField("condition", v)}
          readOnly={!editMode}
        />
        <formComponent.Dropdown
          label="Source"
          value={editedItem.source ?? ""}
          options={allSources}
          onChange={(v) => onChangeField("source", v)}
          readOnly={!editMode}
        />
        <formComponent.Editable
          label="Provider"
          value={editedItem.provider ?? ""}
          onChange={(v) => onChangeField("provider", v)}
          readOnly={!editMode}
        />
        <formComponent.Editable
          label="Description"
          value={editedItem.description ?? ""}
          onChange={(v) => onChangeField("description", v)}
          textarea
          readOnly={!editMode}
        />
        <formComponent.Editable
          label="Note"
          value={editedItem.note ?? ""}
          onChange={(v) => onChangeField("note", v)}
          textarea
          readOnly={!editMode}
        />

        <formComponent.Text label="Created At" value={new Date(item.created_at).toLocaleString()} />

        <QRCodeStyled url={`${window.location.origin}/api/items/${item.id}`} />
      </div>

      <div className="grid mt-6">
        <TagSelector
          title="Installations"
          allItems={allInstallations}
          selectedIds={selectedInstallations}
          toggleSelected={toggleSelectedInstallations}
          disabled={!editMode}
          color="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <TagSelector
          title="Ports"
          allItems={allPorts}
          selectedIds={selectedPorts}
          toggleSelected={toggleSelectedPort}
          disabled={!editMode}
          color="bg-blue-100"
        />
        <TagSelector
          title="Parts"
          allItems={allParts}
          selectedIds={selectedParts}
          toggleSelected={toggleSelectedPart}
          disabled={!editMode}
          color="bg-green-100"
        />
        <TagSelector
          title="Missing"
          allItems={allParts}
          selectedIds={selectedMissings}
          toggleSelected={toggleSelectedMissing}
          disabled={!editMode}
          color="bg-red-100"
        />
      </div>
    </div>
  );
}
