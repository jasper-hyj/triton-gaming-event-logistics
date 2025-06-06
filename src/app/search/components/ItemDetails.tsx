import { Item } from "@/utils/supabase/repositories/ItemsRepository";
import { Part } from "@/utils/supabase/repositories/PartsRepository";
import { Port } from "@/utils/supabase/repositories/PortsRepository";
import TagSelector from "./TagSelector";
import FieldEditable from "./FieldEditable";
import Field from "./Field";

type ItemDetailsProps = {
  item: Item;
  editedItem: Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>;
  onChangeField: (field: keyof Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>, value: string | string[]) => void;
  editMode: boolean;

  allPorts: Port[];
  allParts: Part[];

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
  allPorts,
  allParts,
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
          label="Name"
          value={editedItem.name ?? ''}
          onChange={(v) => onChangeField('name', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Type"
          value={editedItem.type ?? ''}
          onChange={(v) => onChangeField('type', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Condition"
          value={editedItem.condition ?? ''}
          onChange={(v) => onChangeField('condition', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Provider"
          value={editedItem.provider ?? ''}
          onChange={(v) => onChangeField('provider', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Source"
          value={editedItem.source ?? ''}
          onChange={(v) => onChangeField('source', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Password"
          value={editedItem.password ?? ''}
          onChange={(v) => onChangeField('password', v)}
          readOnly={!editMode}
        />
        <FieldEditable
          label="Installations"
          value={(editedItem.installations ?? []).join(', ')}
          onChange={(v) => onChangeField('installations', v.split(',').map((s) => s.trim()))}
          placeholder="Comma separated"
          readOnly={!editMode}
        />
        <FieldEditable
          label="Note"
          value={editedItem.note ?? ''}
          onChange={(v) => onChangeField('note', v)}
          textarea
          readOnly={!editMode}
        />
        <FieldEditable
          label="Description"
          value={editedItem.description ?? ''}
          onChange={(v) => onChangeField('description', v)}
          textarea
          readOnly={!editMode}
        />

        <Field label="Created At" value={new Date(item.created_at).toLocaleString()} />
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