import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { connect } from "react-redux";
import { fetchRecords, setPage } from "../../redux/actions/dashboardActions";

const DataTable = ({
  children,
  data,
  rowClick,
  columns,
  total,
  fetchRecords,
  setPage,
  pageIndex,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data: data,
      manualPagination: true,
      pageCount: total > 0 ? Math.ceil(total / 10) : 0,
      autoResetPage: false,
      initialState: {
        pageIndex: pageIndex - 1, // react table's index starts with 0 but for backend req we start at 1
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="relative">
      {children}
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="border-x-0 border-gray-50">
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 text-sm font-bold tracking-wider text-left text-gray-900 uppercase "
                  key={column["Header"]}
                >
                  <div className="flex justify-between">
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-sort-down"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-sort-up"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                          </svg>
                        )
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-sort-up"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="pl-2 dashboard-data"
                onClick={() => rowClick(row)}
                key={row.id}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="p-2 py-4"
                      key={`${index} ${row.id} ${cell.value}`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-center py-4">
        <button
          type="button"
          onClick={() => {
            previousPage();
            setPage(pageIndex - 1);
            fetchRecords();
          }}
          disabled={!canPreviousPage}
          className="px-3 py-2 mr-4 text-white bg-blue-500 rounded"
        >
          Previous
        </button>
        <span className="mr-4">
          Page
          <strong>
            {pageIndex} of {pageOptions.length}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => {
            nextPage();
            setPage(pageIndex + 1);
            fetchRecords();
          }}
          disabled={!canNextPage}
          className="px-3 py-2 text-white bg-blue-500 rounded "
        >
          Next
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.records.records,
  total: state.records.total,
  pageIndex: state.records.page,
});

export default connect(mapStateToProps, { fetchRecords, setPage })(DataTable);
