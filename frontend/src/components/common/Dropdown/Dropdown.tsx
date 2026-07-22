// src/components/common/Dropdown.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: 'auto' | 'full';
  className?: string;
  onSelect?: (item: DropdownItem) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  width = 'auto',
  className = '',
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (!item.disabled) {
      onSelect?.(item);
      item.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full pt-2 z-50 ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${width === 'full' ? 'w-full' : 'min-w-[200px]'}`}
          >
            <div className="bg-white rounded-xl shadow-xl border border-[#EDE8E2] overflow-hidden py-1.5">
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.divider ? (
                    <div className="h-px bg-[#EDE8E2] my-1.5" />
                  ) : (
                    <button
                      onClick={() => handleSelect(item)}
                      disabled={item.disabled}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        item.disabled
                          ? 'text-[#94A3B8] cursor-not-allowed'
                          : 'text-[#475569] hover:bg-[#F8F2EC] hover:text-[#2D5A27]'
                      }`}
                    >
                      {item.icon && <span className="text-base">{item.icon}</span>}
                      {item.label}
                    </button>
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

export default Dropdown;