export const columns = [
  {
    Header: 'Device',
    accessor: 'Device',
    id: 'device',
    Cell: ({ row }) => {
      const { device } = row.original
      return `${device.identifier}`
    },
  },
  {
    Header: 'Username',
    accessor: 'Username',
    id: 'username',
    Cell: ({ row }) => {
      const { user } = row.original
      return `${user.first_name} ${user.last_name}`
    },
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'assigned date',
    accessor: 'assigned_at',
  },
  {
    Header: 'unassigned date',
    accessor: 'unassigned_at',
  },
]
