export const columns = [
  {
    Header: 'Username',
    accessor: 'Username',
    id: 'username',
    Cell: ({ row }) => {
      const { user } = row.original;
      return `${user.first_name} ${user.last_name}`;
    },
  },
  {
    Header: 'start date',
    accessor: 'start_date',
    Cell: ({ value }) => new Date(value).toISOString().slice(0, 10),
  },
  {
    Header: 'end date',
    accessor: 'end_date',
    Cell: ({ value }) => new Date(value).toISOString().slice(0, 10),
  },
  {
    Header: 'duration',
    accessor: 'duration',
    Cell: ({ row }) => {
      const { duration } = row.original
      return duration;
    },
  },
  {
    Header: 'reason',
    accessor: 'reason',
    Cell: ({ row }) => row.original.title,
  },
  { Header: 'status', accessor: 'status' },
];

export const data = [
  {
    username: 'Sagar Shah',
    start_date: '2016-02-15',
    end_date: '2016-02-18',
    duration: '3',
    reason: 'a mild fever',
    status: 'approved',
  },
  {
    username: 'Sujan BAsnet',
    start_date: '2022-03-08',
    end_date: '2016-02-15',
    duration: '1',
    reason: 'feeling lazy',
    status: 'rejected',
  },
  {
    username: 'Nihal Dhakal',
    start_date: '2022-02-14',
    end_date: '2022-02-15',
    duration: '1',
    reason: 'need to go to hospital',
    status: 'approved',
  },
];
