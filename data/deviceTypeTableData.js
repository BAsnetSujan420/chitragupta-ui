export const columns = [
  {
    Header: 'S.N.',
    Cell: (row) => {
      return <div>{Number(row.row.id) + 1}</div>
    },
  },

  {
    Header: 'Device Type',
    accessor: 'device_type',
  },
]
