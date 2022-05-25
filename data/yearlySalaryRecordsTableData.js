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
    Header: 'Annual Base',
    accessor: 'annual_base',
  },
  {
    Header: 'SSF',
    accessor: 'ssf',
  },
  {
    Header: 'Life Insurance',
    accessor: 'life_insurance',
  },
  {
    Header: 'Health Insurance',
    accessor: 'health_insurance',
  },
  {
    Header: 'Salary',
    accessor: 'salary',
  },
  {
    Header: 'Tax',
    accessor: 'tax',
  },
  {
    Header: 'Cash Dispatched',
    accessor: 'cash_dispatched',
  },
  {
    Header: 'Fiscal Year',
    accessor: 'fiscal_year',
  },
  {
    Header: 'SSF Office',
    accessor: 'ssf_office',
  },
  {
    Header: 'SSF Employee',
    accessor: 'ssf_employee',
  },
  {
    Header: 'Cash In Hand',
    accessor: 'cash_in_hand',
  },
]
