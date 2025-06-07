import React from "react";

type FieldDropdownProps = {
    label: string;
    value: string;
    options: { id: string }[];
    onChange: (value: string) => void;
    readOnly?: boolean;
};

export default function FieldDropdown({
    label,
    value,
    options,
    onChange,
    readOnly = false,
}: FieldDropdownProps) {
    return (
        <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">{label}</label>
            {readOnly ? (
                <p className="text-2xl min-h-[36px] text-gray-900 whitespace-pre-wrap">{value || '—'}</p>
            ) : (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={readOnly}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 placeholder-gray-400"
                >
                    <option value="" disabled >-- Select {label} --</option>
                    {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.id}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
