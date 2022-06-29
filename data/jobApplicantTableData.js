export const columns = [
  {
    Header: 'First Name',
    accessor: 'first_name',
  },
  {
    Header: 'Last Name',
    accessor: 'last_name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Primary Phone Number',
    accessor: 'primary_phone_number',
  },
  {
    Header: 'Secondary Phone Number',
    accessor: 'secondary_phone_number',
  },
  {
    Header: 'Referrer Id',
    accessor: 'referrer_id',
  },
  {
    Header: 'CV',
    accessor: 'cv_links',
    Cell: e => <a href={e.value} target="_blank"> Download CV</a>,
  }
]
