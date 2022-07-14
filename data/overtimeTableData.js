export const columns = [
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
    Header: 'Seconds Tracked',
    accessor: 'seconds_tracked',
  },
]
