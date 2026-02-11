import React from 'react';

const RadioGroup = ({ label, options, value, onChange, error }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-rose-gold-50 dark:hover:bg-rose-gold-900/10 transition-colors"
          >
            <input
              type="radio"
              name={option.value}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-rose-gold-500"
            />
            <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RadioGroup;
