import React, { useEffect, useRef } from 'react';

function CombineContextMenu({ x, y, combineId, onAction, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-48 bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5"
      style={{ top: y, left: x }}
    >
      <button onClick={() => { onAction('view_main', combineId); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        Main Details
      </button>
      <button onClick={() => { onAction('view_transport', combineId); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        Transport Details
      </button>
      <button onClick={() => { onAction('view_erected', combineId); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        Erected Details
      </button>
    </div>
  );
}

export default React.memo(CombineContextMenu);