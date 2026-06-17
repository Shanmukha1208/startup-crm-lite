import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Debounced search input with magnifying glass and clear button.
 *
 * @param {Object} props
 * @param {string} props.value - Debounced search value controlled by parent
 * @param {function} props.onChange - Called with debounced value after 300ms idle
 */
export default function SearchBar({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onChange]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative w-full sm:w-80">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray/70 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark placeholder-text-gray focus:outline-none focus:border-primary focus:bg-white transition-colors duration-200"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-text-gray hover:text-text-dark hover:bg-slate-200/60 transition-colors duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
