import { connect } from 'react-redux'
import Link from 'next/link'
import Card from '../../components/card'
import Navbar from '../../components/layout/Navbar'
import { Btn } from '../../components/formComponents'
import Loader from '../../components/ui/loader'

const Admin = ({ user, loading }) => {
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
      topic: 'Overtimes',
      description: 'View and manage overtimes',
      link: '/admin/overtimes',
    },
    {
      topic: 'Device Types',
      description: 'View and manage device types',
      link: '/admin/deviceTypes',
    },
    {
      topic: 'Devices',
      description: 'View and manage devices',
      link: '/admin/devices',
    },
    {
      topic: 'Device Users',
      description: 'View and manage device users',
      link: '/admin/deviceUsers',
    },
    {
      topic: 'Device Managers',
      description: 'View and manage device managers',
      link: '/admin/deviceManagers',
    },
    {
      topic: 'Invite User',
      description: 'Invite new users to the organization',
      link: '/users/invite_form',
    }
  ]

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
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loading: state.auth.loading,
})
export default connect(mapStateToProps)(Admin)
