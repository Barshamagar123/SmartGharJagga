// src/components/common/Navbar/DropdownMenu.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ✅ Export as type
export interface DropdownItem {
  label?: string;
  path?: string;
  icon?: string;
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
    triggerMode?: 'click' | 'hover';  // ✅ ADD THIS!

}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, items, align = 'right' }) => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} 
            mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 
            py-1 z-50 animate-fadeIn`}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <hr className="my-1 border-gray-200" />
              ) : (
                <Link
                  to={item.path || '#'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 
                    hover:bg-primary-light hover:text-primary transition-colors duration-200"
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;