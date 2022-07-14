export const columns = [
  {
    Header: 'Username',
    accessor: 'Username',
    id: 'username',
    Cell: ({ row }) => {
      const user = row.original;
      return `${user.first_name} ${user.last_name}`;
    },
  },
  {
    Header: 'email',
    accessor: 'email',
  },
  {
    Header: 'Join Date',
    accessor: 'start_date',
    Cell: ({ value }) => new Date(value).toISOString().slice(0, 10),
  },
  {
    Header: 'Leave Requests',
    accessor: 'leave_request_days_count',
  },
];
