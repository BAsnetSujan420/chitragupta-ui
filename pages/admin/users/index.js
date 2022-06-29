import { useEffect } from 'react'
import { connect } from 'react-redux'
import Navbar from '../../../components/layout/Navbar'
import UsersDataTable from '../../../components/dashboard/UsersDataTable'
import { fetchUsers } from '../../../redux/actions/usersActions'

const Users = (props) => {
  useEffect(() => {
    if (props.token) {
      props.fetchUsers()
    }
  }, [props.token])

  return (
    <>
      <Navbar />
      <div className="p-12 mx-6 -mt-6 bg-white rounded shadow h-3/5">
        <UsersDataTable />
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
})

export default connect(mapStateToProps, {
  fetchUsers,
})(Users)
