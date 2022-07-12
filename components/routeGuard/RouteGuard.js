import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { loadUser, setToken, resetRedirect } from '../../redux/actions/authActions'

const RouteGuard = (props) => {
  const router = useRouter()

  const pathCheck = (url) => {
    const adminPaths = [
      '/admin',
      '/admin/users',
      '/admin/salaries',
      '/admin/salarySettings',
      '/admin/salaryRecords',
      '/admin/YearlySalary',
      '/users/invite_form',
    ]

    const path = url.split('?')[0]
    if (props.user) {
      if (props.user.role !== 'admin') {
        if (adminPaths.includes(path)) {
          router.push('/')
        }
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      props.setToken(token)
    }
    if(props.redirect) {
      const { redirect } = props

      router.push(redirect)
      props.resetRedirect()
    }
    const publicPaths = ['/login', '/users/invitation_accept']
    if (!token && !publicPaths.includes(router.pathname)) {
      router.push({
        pathname: '/login',
        // after login redirect to intended page
        query: { returnUrl: window.location.pathname },
      })
    } else if (!props.isAuthenticated && token) {
      props.loadUser()
    }
    pathCheck(router.asPath)
  }, [props.redirect, props.user])
  return props.children
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  redirect: state.auth.redirect,
})
export default connect(mapStateToProps, { loadUser, setToken, resetRedirect })(RouteGuard)
