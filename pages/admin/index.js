import { connect } from 'react-redux';
import Link from 'next/link';
import Card from '../../components/card';
import Navbar from '../../components/layout/Navbar';
import { Btn } from '../../components/formComponents';
import Loader from '../../components/ui/loader';

function Admin({ user, loading }) {
  const adminPages = [
    {
      topic: 'User',
      description: 'View and manage users',
      link: '/admin/users',
    },
    {
      topic: 'Salary',
      description: 'View and manage salaries',
      link: '/admin/salaries',
    },
    {
      topic: 'Salary Settings',
      description: 'View and manage salary settings',
      link: '/admin/salarySettings',
    },
    {
      topic: 'Salary Records',
      description: 'View and manage salary records',
      link: '/admin/salaryRecords',
    },
    {
      topic: 'Yearly Salary Records',
      description: 'View and manage yearly salary records',
      link: '/admin/yearlySalaryRecords'
    }
  ];

  return user && !loading && user.role === 'admin' ? (
    <>
      <Navbar />
      <div className="flex flex-wrap m-5">
        {adminPages.map((page) => (
          <Card
            topic={page.topic}
            description={page.description}
            key={page.topic}
          >
            <Link href={page.link}>
              <Btn className="bg-gray-500">Visit</Btn>
            </Link>
          </Card>
        ))}
      </div>
    </>
  ) : (
    <Loader />
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.auth.loading,
});
export default connect(mapStateToProps)(Admin);
