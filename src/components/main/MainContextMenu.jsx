// src/components/main/MainContextMenu.jsx
import React from 'react';

const Icons = {
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Transport: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Truck Body */}
      <rect x="1" y="3" width="15" height="13" />
      {/* Truck Cabin */}
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      {/* Wheels */}
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Erected: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Vertical Tower */}
      <path d="M6 21V3" />
      {/* Horizontal Jib (Arm) */}
      <path d="M6 7h15" />
      {/* Hook/Line */}
      <path d="M21 7v5" />
      {/* Support Bracing */}
      <path d="M3 21h6" />
      <path d="M6 12l3-3" />
      <path d="M6 16l3-3" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

function MainContextMenu({ x, y, rowId, onAction, onClose }) {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleAction = (action) => {
    onAction(action, rowId);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-48 bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5"
      style={{ top: y, left: x }}
    >
      <button
        onClick={() => handleAction('view')}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-400"><Icons.Eye /></span> View Details
      </button>
      <button
        onClick={() => handleAction('transport')}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-400"><Icons.Transport /></span> Transport
      </button>
      <button
        onClick={() => handleAction('transport')}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-400"><Icons.Erected /></span> Erected
      </button>
      <button
        onClick={() => handleAction('edit')}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-400"><Icons.Edit /></span> Edit
      </button>
      <button
        onClick={() => handleAction('duplicate')}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-400"><Icons.Copy /></span> Duplicate
      </button>
      <div className="border-t border-gray-100 my-1" />
      <button
        onClick={() => handleAction('delete')}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <span className="text-red-400"><Icons.Trash /></span> Delete
      </button>
    </div>
  );
}

export default React.memo(MainContextMenu);