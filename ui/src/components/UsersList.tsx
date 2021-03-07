import React from 'react';
import { HiOutlineChevronRight, HiOutlineUser } from 'react-icons/hi';
import { useTable, Column, Cell } from 'react-table';
import { Link } from 'react-router-dom';
import { FormattedDate } from 'react-intl';

import { User } from '../graphql-operations';
import { ListPagination, TablePagination } from './Pagination';

function getCellProps(cell: Cell<Partial<User>>) {
  switch (cell.column.id) {
    case 'email':
      return {
        className:
          'max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-gray-900',
      };
    default:
      return {
        className:
          'px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500',
      };
  }
}

function getHeaderProps(column: Column<Partial<User>>) {
  return {};
}

function getColumnProps(column: Column<Partial<User>>) {
  return {};
}

const columns: Column<Partial<User>>[] = [
  {
    id: 'email',
    accessor: 'email',
    Header: 'email',
  },
  {
    id: 'name',
    accessor: 'name',
    Header: 'name',
  },
  {
    id: 'createdDate',
    accessor: 'createdDate',
    Header: 'created date',
    Cell: ({ value }: { value: string }) => {
      return (
        <FormattedDate value={value} dateStyle="medium" timeStyle="short" />
      );
    },
  },
];

export function UsersList({
  users,
  offset,
  total,
}: {
  users: Partial<User>[];
  offset?: number;
  total?: number;
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Partial<User>>({
    columns,
    data: users,
  });

  const size = users.length;
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
                <Link
                  to={`${row.values['id']}`}
                  className="block px-4 py-4 bg-white hover:bg-gray-50"
                >
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      <HiOutlineUser className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="flex flex-col text-gray-500 text-sm truncate">
                        <span className="truncate">
                          {row.cells[0].render('Cell')}
                        </span>
                        <span>{row.cells[2].render('Cell')}</span>
                      </span>
                    </span>
                    <HiOutlineChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  </span>
                </Link>
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
                          {...column.getHeaderProps([
                            getColumnProps(column),
                            getHeaderProps(column),
                          ])}
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
                            {...cell.getCellProps([
                              getColumnProps(cell.column),
                              getCellProps(cell),
                            ])}
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
