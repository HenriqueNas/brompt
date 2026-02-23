import React from 'react';
import { FieldOption } from '../schema';

interface DynamicSelectProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  options: FieldOption[];
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  id,
  label,
  description,
  value,
  options,
  onChange,
  isLoading = false,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute right-8 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600"></div>
        )}
      </div>
    </div>
  );
};
