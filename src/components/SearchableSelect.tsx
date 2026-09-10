'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

export interface SearchableItem {
  id: string;
  manufacturer: string;
  model: string;
  powerWatts: number;
}

interface SearchableSelectProps<T extends SearchableItem> {
  label: string;
  id: string;
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  noMatchMessage: string;
  placeholder?: string;
}

export function filterItems<T extends SearchableItem>(items: T[], query: string): T[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;

  const keywords = trimmed.split(/\s+/);
  return items.filter((item) => {
    const fullText = `${item.manufacturer} ${item.model} ${item.id}`.toLowerCase();
    return keywords.every((kw) => fullText.includes(kw));
  });
}

export function groupItemsByManufacturer<T extends SearchableItem>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.manufacturer]) {
      groups[item.manufacturer] = [];
    }
    groups[item.manufacturer].push(item);
  }
  return groups;
}

export function SearchableSelect<T extends SearchableItem>({
  label,
  id,
  items,
  selectedId,
  onSelect,
  noMatchMessage,
  placeholder = 'Suchen... z. B. Ryzen 7, 9800X3D',
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  const selectedItem = items.find((item) => item.id === selectedId) || items[0];

  const filteredItems = filterItems(items, searchQuery);
  const groupedItems = groupItemsByManufacturer(filteredItems);
  const manufacturerKeys = Object.keys(groupedItems);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectItem = (item: T) => {
    onSelect(item.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          id={id}
          onClick={handleToggleOpen}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="w-full text-left p-3 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between cursor-pointer"
        >
          <span className="truncate">
            {selectedItem ? (
              <>
                <span className="font-semibold">{selectedItem.manufacturer}</span> {selectedItem.model} ({selectedItem.powerWatts} W)
              </>
            ) : (
              'Bitte wählen...'
            )}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-80 flex flex-col animate-fadeIn">
            {/* Search Input Field */}
            <div className="p-2 border-b border-slate-700 bg-slate-850">
              <label htmlFor={searchInputId} className="sr-only">
                {label} suchen
              </label>
              <input
                ref={inputRef}
                id={searchInputId}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 p-1 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400" role="status">
                  {noMatchMessage}
                </div>
              ) : (
                manufacturerKeys.map((mfg) => (
                  <div key={mfg} className="space-y-1">
                    <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/60 rounded">
                      {mfg}
                    </div>
                    <ul role="listbox">
                      {groupedItems[mfg].map((item) => {
                        const isSelected = item.id === selectedId;
                        return (
                          <li
                            key={item.id}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleSelectItem(item)}
                            className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-blue-600/30 text-blue-200 font-semibold border border-blue-500/40'
                                : 'text-slate-200 hover:bg-slate-700/70 hover:text-white'
                            }`}
                          >
                            <span>
                              <span className="text-slate-400 mr-1.5">{item.manufacturer}</span>
                              {item.model}
                            </span>
                            <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded">
                              {item.powerWatts} W
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Component Information (Subtle Display) */}
      {selectedItem && (
        <div className="pt-1 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-1">
          <span className="truncate">
            {selectedItem.manufacturer} {selectedItem.model}
          </span>
          <span className="text-slate-300">
            Geschätzte Leistung: <strong className="text-blue-400 font-mono font-semibold">{selectedItem.powerWatts} W</strong>
          </span>
        </div>
      )}
    </div>
  );
}
