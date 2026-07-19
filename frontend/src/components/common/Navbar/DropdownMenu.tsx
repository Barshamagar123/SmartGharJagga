// src/components/common/Navbar/DropdownMenu.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES - Fixed divider issue
// ============================================
export interface DropdownItem {
  label?: string;  // Made optional for dividers
  path?: string;
  icon?: string;
  divider?: boolean;
  onClick?: () => void;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  triggerMode?: 'hover' | 'click';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'left',
  triggerMode = 'hover',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (triggerMode === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [triggerMode]);

  const handleMouseEnter = () => {
    if (triggerMode === 'hover') setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (triggerMode === 'hover') setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (triggerMode === 'click') setIsOpen(!isOpen);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute top-full pt-2 ${
              align === 'right' ? 'right-0' : 'left-0'
            } min-w-[220px]`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden py-1.5">
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.divider ? (
                    <div className="h-px bg-gray-100 my-1.5" />
                  ) : (
                    item.path ? (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      >
                        {item.icon && <span className="text-base">{item.icon}</span>}
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.onClick?.();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                      >
                        {item.icon && <span className="text-base">{item.icon}</span>}
                        {item.label}
                      </button>
                    )
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;