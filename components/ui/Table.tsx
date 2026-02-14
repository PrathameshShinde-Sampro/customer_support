import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-900/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-5 text-left text-[11px] font-bold text-indigo-300 uppercase tracking-widest"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tr className="hover:bg-white/5 transition-colors duration-200 group">{children}</tr>;
};

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <td className={`px-6 py-4 whitespace-nowrap text-sm text-slate-200 ${className}`}>{children}</td>;
};
