export const columns = [
  {
    Header: 'Title',
    accessor: 'title',
  },
  {
    Header: 'Year',
    accessor: 'year',
  },
  {
    Header: 'Remarks',
    accessor: 'remarks',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Manager',
    accessor: 'manager',
    id: 'manager',
    Cell: ({ row }) => {
      console.log(row)
      const { manager } = row.original
      return manager ? `${manager.first_name} ${manager.last_name}` : 'N/A'
    },
  },
]
