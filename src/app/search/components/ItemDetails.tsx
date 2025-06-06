import { Item } from "@/utils/supabase/repositories/ItemsRepository";
import { Part } from "@/utils/supabase/repositories/PartsRepository";
import { Port } from "@/utils/supabase/repositories/PortsRepository";
import { Installation } from "@/utils/supabase/repositories/InstallationsRepository";
import TagSelector from "./TagSelector";
import FieldEditable from "./FieldEditable";
import Field from "./Field";
import FieldDropdown from "./FieldDropdown";
import { Type } from "@/utils/supabase/repositories/TypesRepository";
import { Condition } from "@/utils/supabase/repositories/ConditionsRepository";
import { Source } from "@/utils/supabase/repositories/SourcesRepository";

type ItemDetailsProps = {
  item: Item;
  editedItem: Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>;
  onChangeField: (field: keyof Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>, value: string | string[]) => void;
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
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mt-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <FieldEditable
          label="Id"
          value={editedItem.id ?? ''}
          onChange={(v) => onChangeField('id', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Name"
          value={editedItem.name ?? ''}
          onChange={(v) => onChangeField('name', v)}
          readOnly={!editMode}
        />
        <FieldDropdown
          label="Type"
          value={editedItem.type ?? ""}
          options={allTypes.map((t) => t.id)}
          onChange={(v) => onChangeField("type", v)}
          readOnly={!editMode}
        />
        <FieldDropdown
          label="Condition"
          value={editedItem.condition ?? ""}
          options={allConditions.map((t) => t.id)}
          onChange={(v) => onChangeField("condition", v)}
          readOnly={!editMode}
        />
        <FieldDropdown
          label="Source"
          value={editedItem.source ?? ''}
          options={allSources.map((t) => t.id)}
          onChange={(v) => onChangeField('source', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Provider"
          value={editedItem.provider ?? ''}
          onChange={(v) => onChangeField('provider', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Description"
          value={editedItem.description ?? ''}
          onChange={(v) => onChangeField('description', v)}
          textarea
          readOnly={!editMode}
        />
        <FieldEditable
          label="Note"
          value={editedItem.note ?? ''}
          onChange={(v) => onChangeField('note', v)}
          textarea
          readOnly={!editMode}
        />

        <Field label="Created At" value={new Date(item.created_at).toLocaleString()} />
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