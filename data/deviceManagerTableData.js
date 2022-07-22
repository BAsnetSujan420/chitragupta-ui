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
    Header: 'Manager',
    accessor: 'Username',
    id: 'username',
    Cell: ({ row }) => {
      const { user } = row.original
      return `${user.first_name} ${user.last_name}`
    },
  },

  {
    Header: 'Assigned at',
    accessor: 'assigned_at',
  },

  {
    Header: 'Unassigned at',
    accessor: 'unassigned_at',
  },
]
