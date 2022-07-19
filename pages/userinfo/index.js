import { connect } from 'react-redux'
import Link from 'next/link'
import Card from '../../components/card'
import Navbar from '../../components/layout/Navbar'
import { Btn } from '../../components/formComponents'
import Loader from '../../components/ui/loader'

const User = ({ user, loading }) => {
    const userPages = [
      {
        topic: 'Overtimes',
        description: 'View and manage overtimes',
        link: '/admin/overtimes',
      },
      {
        topic: 'Invite User',
        description: 'Invite new users to the organization',
        link: '/users/invite_form',
      },
      {
        topic: 'Devices',
        description: 'View Devices being used and managed',
        link: '#',
      },
    ]

  return user && !loading && user.role === 'user' ? (
    <>
      <Navbar />
      <div className="flex flex-wrap m-5">
        {userPages.map((page) => (
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
export default connect(mapStateToProps)(User)
