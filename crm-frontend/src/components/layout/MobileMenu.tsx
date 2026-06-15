'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryData } from '@/lib/categoriesData';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const toggleSubCategory = (subName: string) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subName]: !prev[subName],
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={styles.backdrop}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={styles.drawer}
          >
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Departments</span>
              <button onClick={onClose} className={styles.closeBtn} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className={styles.nav}>
              {categoryData.map((cat) => {
                const isCatExpanded = !!expandedCategories[cat.name];
                return (
                  <div key={cat.name} className={styles.categoryBlock}>
                    <div className={styles.categoryHeader}>
                      <Link
                        href={cat.href}
                        onClick={onClose}
                        className={styles.categoryMainLink}
                      >
                        {cat.name}
                      </Link>
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className={styles.expandBtn}
                        aria-label={`Toggle ${cat.name}`}
                      >
                        <ChevronDown
                          size={18}
                          className={`${styles.chevron} ${isCatExpanded ? styles.chevronOpen : ''}`}
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isCatExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={styles.subCatContainer}
                        >
                          {cat.subcategories.map((sub) => {
                            const isSubExpanded = !!expandedSubCategories[sub.name];
                            return (
                              <div key={sub.name} className={styles.subCategoryBlock}>
                                <div className={styles.subCategoryHeader}>
                                  <Link
                                    href={sub.href}
                                    onClick={onClose}
                                    className={styles.subCatLink}
                                  >
                                    {sub.name}
                                  </Link>
                                  {sub.items && (
                                    <button
                                      onClick={() => toggleSubCategory(sub.name)}
                                      className={styles.expandSubBtn}
                                      aria-label={`Toggle ${sub.name}`}
                                    >
                                      <ChevronDown
                                        size={14}
                                        className={`${styles.chevron} ${isSubExpanded ? styles.chevronOpen : ''}`}
                                      />
                                    </button>
                                  )}
                                </div>

                                {sub.items && isSubExpanded && (
                                  <div className={styles.nestedItemsList}>
                                    {sub.items.map((item) => {
                                      const itemHref = `${sub.href}?q=${encodeURIComponent(item)}`;
                                      return (
                                        <Link
                                          key={item}
                                          href={itemHref}
                                          onClick={onClose}
                                          className={styles.nestedLink}
                                        >
                                          {item}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className={styles.footer}>
              <Link href="/account" onClick={onClose} className={styles.footerLink}>
                My Account
              </Link>
              <Link href="/track-order" onClick={onClose} className={styles.footerLink}>
                Track Order
              </Link>
              <Link href="/store-finder" onClick={onClose} className={styles.footerLink}>
                Store Finder
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
