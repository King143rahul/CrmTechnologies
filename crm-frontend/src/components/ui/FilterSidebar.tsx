'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FilterSidebar.module.css';

export interface FilterState {
  brands: string[];
  priceMin: string;
  priceMax: string;
  ram: string[];
  processor: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

const BRAND_OPTIONS = ['Lenovo', 'Dell', 'HP', 'Asus', 'Acer', 'Samsung', 'MSI', 'Apple'];
const RAM_OPTIONS = ['4GB', '8GB', '16GB', '32GB', '64GB'];
const PROCESSOR_OPTIONS = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M-Series'];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.filterSection}>
      <button className={styles.filterHeader} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.filterLabel}>{title}</span>
        <ChevronDown
          size={16}
          className={`${styles.filterChevron} ${isOpen ? styles.filterChevronOpen : ''}`}
        />
      </button>
      {isOpen && <div className={styles.filterBody}>{children}</div>}
    </div>
  );
}

export function FilterSidebar({ filters, onFilterChange, onClear }: FilterSidebarProps) {
  const toggleArrayFilter = (key: 'brands' | 'ram' | 'processor', value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.ram.length > 0 ||
    filters.processor.length > 0 ||
    filters.priceMin !== '' ||
    filters.priceMax !== '';

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>Filter Products</h3>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        {BRAND_OPTIONS.map((brand) => (
          <label key={brand} className={styles.checkboxItem}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleArrayFilter('brands', brand)}
            />
            <span className={styles.checkboxLabel}>{brand}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            className={styles.priceInput}
            value={filters.priceMin}
            onChange={(e) => onFilterChange({ ...filters, priceMin: e.target.value })}
          />
          <span className={styles.priceSeparator}>–</span>
          <input
            type="number"
            placeholder="Max"
            className={styles.priceInput}
            value={filters.priceMax}
            onChange={(e) => onFilterChange({ ...filters, priceMax: e.target.value })}
          />
        </div>
      </FilterSection>

      {/* RAM Filter */}
      <FilterSection title="RAM">
        {RAM_OPTIONS.map((ram) => (
          <label key={ram} className={styles.checkboxItem}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.ram.includes(ram)}
              onChange={() => toggleArrayFilter('ram', ram)}
            />
            <span className={styles.checkboxLabel}>{ram}</span>
          </label>
        ))}
      </FilterSection>

      {/* Processor Filter */}
      <FilterSection title="Processor">
        {PROCESSOR_OPTIONS.map((proc) => (
          <label key={proc} className={styles.checkboxItem}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.processor.includes(proc)}
              onChange={() => toggleArrayFilter('processor', proc)}
            />
            <span className={styles.checkboxLabel}>{proc}</span>
          </label>
        ))}
      </FilterSection>

      {/* Actions */}
      <div className={styles.actions}>
        {hasActiveFilters && (
          <button onClick={onClear} className={styles.clearBtn}>
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
}

export default FilterSidebar;
