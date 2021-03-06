import React, { useMemo } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { useTable, Column } from 'react-table';

import { ListPagination, TablePagination } from './Pagination';

export function TabularList<T>({
  data,
  offset,
  total,
  columns,
}: {
  data: T[];
  columns: string[];
  offset?: number;
  total?: number;
}) {
  const expandedColumns = useMemo(
    () =>
      columns.map<Column<any>>((column) => ({
        id: column,
        accessor: column,
        Header: column,
        Cell: ({ value }: { value: unknown }) => {
          return value;
        },
      })),
    [columns.join(',')]
  );
  const tableInstance = useTable<any>({
    columns: expandedColumns,
    data,
  });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const size = data.length;
  const from = size == 0 ? 0 : (offset ?? 0) + 1;
  const to = (offset ?? 0) + size;

  return (
    <>
      <div className="shadow sm:hidden">
        <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <li {...row.getRowProps()}>
                <a
                  href="#"
                  className="block px-4 py-4 bg-white hover:bg-gray-50"
                >
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      Value
                    </span>
                    <HiOutlineChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <ListPagination from={from} to={to} total={total ?? size} />
      </div>

      <div className="hidden sm:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col mt-2">
            <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
              <table
                className="min-w-full divide-y divide-gray-200"
                {...getTableProps()}
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps()}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-gray-200"
                  {...getTableBodyProps()}
                >
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr className="bg-white" {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500"
                            {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <TablePagination from={from} to={to} total={total ?? size} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
