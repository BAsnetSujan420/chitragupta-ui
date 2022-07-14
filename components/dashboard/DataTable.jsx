import { useEffect } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { connect } from 'react-redux'
import { setPage } from '../../redux/actions/dashboardActions'
import Loader from '../ui/loader'

const DataTable = ({
  children,
  data,
  rowClick,
  columns,
  total,
  setPage,
  pageIndex,
  fetchFunction,
  token,
  loading,
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
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: total > 0 ? Math.ceil(total / 10) : 0,
      autoResetPage: false,
      initialState: {
        pageIndex: pageIndex - 1, // react table's index starts with 0 but for backend req we start at 1
      },
    },
    useSortBy,
    usePagination,
  )

  useEffect(() => {
    if (token) fetchFunction()
  }, [token])

  return !loading ? (
    <div className="relative">
      {children}
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="border-x-0 border-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 text-sm font-bold tracking-wider text-left text-gray-900 uppercase "
                  key={column.Header}
                >
                  <div className="flex justify-between">
                    {column.render('Header')}
                    <span>
                      {column.isSortedDesc ? (
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
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                className="pl-2 dashboard-data"
                onClick={() => rowClick(row)}
                key={row.id}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="p-2 py-4"
                    key={`${new Date().getTime() * Math.random()} ${row.id} ${
                      cell.value
                    }`}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-center py-4">
        <button
          type="button"
          onClick={() => {
            previousPage()
            setPage(pageIndex - 1)
            fetchFunction()
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
            nextPage()
            setPage(pageIndex + 1)
            fetchFunction()
          }}
          disabled={!canNextPage}
          className="px-3 py-2 text-white bg-blue-500 rounded "
        >
          Next
        </button>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

const mapStateToProps = (state) => ({
  data: state.records.records,
  total: state.records.total,
  pageIndex: state.records.page,
  token: state.auth.token,
  loading: state.records.loading,
})

export default connect(mapStateToProps, { setPage })(DataTable)
