export const columns = [
  {
    Header: 'Device Type',
    accessor: 'device_type',
    id: 'device_type',
    Cell: ({ row }) => {
      const { device_type } = row.original
      return device_type.device_type
    },
  },
  {
    Header: 'Username',
    accessor: 'Username',
    id: 'username',
    Cell: ({ row }) => {
      const { user } = row.original
      return user ? `${user.first_name} ${user.last_name}` : ''
    },
  },
  {
    Header: 'Identifier',
    accessor: 'identifier',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
  {
    Header: 'Image',
    accessor: 'image_links',
    id: 'images',
    Cell: ({ row }) => {
      const { image_links, identifier } = row.original
      return (
        <img
          style={{ height: '100px' }}
          src={`${process.env.NEXT_PUBLIC_REMOTE_URL}/${image_links[0]}`}
          alt={identifier}
        />
      )
    },
  },
]
