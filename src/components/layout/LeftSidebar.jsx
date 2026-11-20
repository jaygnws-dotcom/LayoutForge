import React, { useState } from 'react';
import { COMPONENT_CATALOG, COMPONENT_CATEGORIES } from '../../types/elements';
import PaletteItem from '../palette/PaletteItem';
import LayersPanel from '../palette/LayersPanel';
import { Layers, Box, Search, X } from 'lucide-react';

export default function LeftSidebar({
  activeTab: controlledTab,
  onTabChange,
  onClose,
  isMobile = false,
  onItemAdded
}) {
  const [internalTab, setInternalTab] = useState('components');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabChange = (tab) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  const filteredCatalog = COMPONENT_CATALOG.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <aside
      className={
        isMobile
          ? 'w-full h-full flex flex-col select-none bg-surface overflow-hidden'
          : 'w-72 xl:w-80 border-r border-border bg-surface flex flex-col h-[calc(100vh-3.5rem)] select-none shadow-sm'
      }
    >
      {/* Mobile Top Header */}
      {isMobile && (
        <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              {activeTab === 'components' ? <Box className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
            </div>
            <span className="font-bold text-sm text-onSurface">
              {activeTab === 'components' ? 'Component Library' : 'Layers & Structure'}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border text-secondary hover:text-onSurface hover:bg-muted cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Top Tab Switcher */}
      <div className="p-3 border-b border-border flex items-center gap-1 bg-surface shrink-0">
        <button
          onClick={() => handleTabChange('components')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'components'
              ? 'bg-primary text-white shadow-sm'
              : 'text-secondary hover:text-onSurface hover:bg-muted'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Components ({COMPONENT_CATALOG.length})</span>
        </button>
        <button
          onClick={() => handleTabChange('layers')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'layers'
              ? 'bg-primary text-white shadow-sm'
              : 'text-secondary hover:text-onSurface hover:bg-muted'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>
      </div>

      {activeTab === 'components' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 pb-2 border-b border-border bg-surface shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-secondary absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full bg-muted border border-border rounded-lg pl-8 pr-7 py-1.5 text-xs text-onSurface placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-onSurface cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none text-[11px]">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-accentSoft text-primary border border-primary/30 font-medium'
                    : 'text-secondary hover:text-onSurface'
                }`}
              >
                All ({COMPONENT_CATALOG.length})
              </button>
              {COMPONENT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-accentSoft text-primary border border-primary/30 font-medium'
                      : 'text-secondary hover:text-onSurface'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/40">
            {filteredCatalog.map(item => (
              <PaletteItem
                key={item.type}
                item={item}
                onItemAdded={onItemAdded}
              />
            ))}
            {filteredCatalog.length === 0 && (
              <div className="text-center py-8 text-xs text-secondary">
                No matching components found.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <LayersPanel />
        </div>
      )}
    </aside>
  );
}
