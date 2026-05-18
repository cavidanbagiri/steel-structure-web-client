import React, { useState, useEffect } from 'react';

function TransportPagination({ total, limit, offset, onPageChange }) {
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;
  const [gotoInput, setGotoInput] = useState(currentPage);

  // Sync gotoInput when currentPage changes from outside (prev/next buttons)
  useEffect(() => {
    setGotoInput(currentPage);
  }, [currentPage]);

  const goToPage = (page) => {
    console.log('the page is ', page)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      // setGotoInput(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 15;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-start px-5 py-3 bg-gray-50 border border-b-0 border-gray-200  shadow-sm flex-wrap gap-3">
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          ‹
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              page === currentPage
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        >
          ›
        </button>
        
        <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
          <span className="text-xs text-gray-400 font-medium">Go to</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={gotoInput}
            onChange={(e) => setGotoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                goToPage(parseInt(e.target.value));
              }
            }}
            className="w-14 h-9 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
          />
        </div>
      </div><div className="flex items-center gap-4 ml-6">
        <span className="text-sm text-gray-600 font-medium">
          {total.toLocaleString()} <span className="text-gray-400">records</span>
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {offset + 1}–{Math.min(offset + limit, total)}
        </span>
      </div>
    </div>
  );
}

export default React.memo(TransportPagination);




// src/components/transport/TransportPagination.jsx
// import React, { useState, useEffect } from 'react';

// function TransportPagination({ total, limit, offset, onPageChange }) {
//   const totalPages = Math.ceil(total / limit) || 1;
//   const currentPage = Math.floor(offset / limit) + 1;
//   const [gotoInput, setGotoInput] = useState(currentPage);

//   // Sync gotoInput when currentPage changes from outside (prev/next buttons)
//   useEffect(() => {
//     setGotoInput(currentPage);
//   }, [currentPage]);

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       onPageChange(page);
//     }
//   };

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;
//     let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let end = Math.min(totalPages, start + maxVisible - 1);
//     if (end - start + 1 < maxVisible) {
//       start = Math.max(1, end - maxVisible + 1);
//     }
//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   return (
//     <div className="flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-xl shadow-sm flex-wrap gap-3">
//       <div className="flex items-center gap-4">
//         <span className="text-sm text-gray-600 font-medium">
//           {total.toLocaleString()} <span className="text-gray-400">records</span>
//         </span>
//         <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
//           {offset + 1}–{Math.min(offset + limit, total)}
//         </span>
//       </div>
      
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => goToPage(currentPage - 1)}
//           disabled={currentPage <= 1}
//           className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
//         >
//           ‹
//         </button>
        
//         {getPageNumbers().map(page => (
//           <button
//             key={page}
//             onClick={() => goToPage(page)}
//             className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
//               page === currentPage
//                 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
//                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200'
//             }`}
//           >
//             {page}
//           </button>
//         ))}
        
//         <button
//           onClick={() => goToPage(currentPage + 1)}
//           disabled={currentPage >= totalPages}
//           className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
//         >
//           ›
//         </button>
        
//         <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
//           <span className="text-xs text-gray-400 font-medium">Go to</span>
//           <input
//             type="number"
//             min="1"
//             max={totalPages}
//             value={gotoInput}
//             onChange={(e) => setGotoInput(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 goToPage(parseInt(e.target.value));
//               }
//             }}
//             className="w-14 h-9 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default React.memo(TransportPagination);