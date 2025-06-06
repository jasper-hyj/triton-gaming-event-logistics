'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Item } from '@/utils/supabase/repositories/ItemsRepository';

type ItemEditFormProps = {
  item: Item;
  editedItem: Partial<Omit<Item, 'ports' | 'parts' | 'missings'>>;
  onChangeField: (field: keyof typeof editedItem, value: any) => void;
  onSave: () => void;
  loading: boolean;
};

export default function ItemEditForm({
  item,
  editedItem,
  onChangeField,
  onSave,
  loading,
}: ItemEditFormProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.35 }}
        className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 mt-12 max-w-full select-none"
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 tracking-wide">
          Edit Item
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
          <InputField
            label="Name"
            value={editedItem.name || ''}
            onChange={(v) => onChangeField('name', v)}
          />
          <InputField
            label="Type"
            value={editedItem.type || ''}
            onChange={(v) => onChangeField('type', v)}
          />
          <InputField
            label="Condition"
            value={editedItem.condition || ''}
            onChange={(v) => onChangeField('condition', v)}
          />
          <InputField
            label="Provider"
            value={editedItem.provider || ''}
            onChange={(v) => onChangeField('provider', v)}
          />
          <InputField
            label="Source"
            value={editedItem.source || ''}
            onChange={(v) => onChangeField('source', v)}
          />
          <InputField
            label="Password"
            value={editedItem.password || ''}
            onChange={(v) => onChangeField('password', v)}
          />
          <InputField
            label="Installations"
            value={(editedItem.installations || []).join(', ')}
            onChange={(v) =>
              onChangeField(
                'installations',
                v.split(',').map((s) => s.trim())
              )
            }
            placeholder="Comma separated"
          />
          <InputField
            label="Note"
            value={editedItem.note || ''}
            onChange={(v) => onChangeField('note', v)}
            textarea
          />
          <InputField
            label="Description"
            value={editedItem.description || ''}
            onChange={(v) => onChangeField('description', v)}
            textarea
          />
          <Field label="Created At" value={new Date(item.created_at).toLocaleString()} />
        </div>

        <button
          onClick={onSave}
          disabled={loading}
          className="mt-10 w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-400/40 transition duration-300 font-semibold text-lg disabled:opacity-50"
          aria-label="Save item changes"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2 select-text">{label}</label>
      {textarea ? (
        <textarea
          className="resize-y min-h-[72px] max-h-48 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 placeholder-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          spellCheck={false}
        />
      ) : (
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 placeholder-gray-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type="text"
          spellCheck={false}
        />
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <p className="font-semibold text-gray-600 select-text">{label}</p>
      <p className="text-gray-800 mt-1 select-text whitespace-pre-wrap">{value}</p>
    </div>
  );
}
