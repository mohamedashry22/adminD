'use client';

import React, { useEffect, useRef } from 'react';

interface TableProps<T> {
  columns: { header: string; accessor: keyof T }[];
  data: T[];
  loadMore: () => void;
  hasMore: boolean;
  actions?: (item: T) => React.ReactNode;
}

export default function Table<T extends {}>({
  columns,
  data,
  loadMore,
  hasMore,
  actions,
}: TableProps<T>) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (lastRowRef.current) {
      observer.current.observe(lastRowRef.current);
    }

    return () => observer.current?.disconnect();
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="py-2 px-4 border-b">
                {col.header}
              </th>
            ))}
            {actions && <th className="py-2 px-4 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const isLastRow = idx === data.length - 1;
            return (
              <tr
                key={idx}
                ref={isLastRow ? lastRowRef : null}
                className="hover:bg-gray-100"
              >
                {columns.map((col) => (
                  <td key={col.header} className="py-2 px-4 border-b">
                    {String(item[col.accessor])}
                  </td>
                ))}
                {actions && (
                  <td className="py-2 px-4 border-b">{actions(item)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}