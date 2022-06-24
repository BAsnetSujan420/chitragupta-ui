import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'
import { tokenConfig } from './authActions'
import { setShowModal } from './dashboardActions'

export const createOvertime = (overtime) => (dispatch, getState) => {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/overtimes.json`,
      {
        overtime,
      },
      tokenConfig(getState),
    )
    .then((res) => {
      dispatch(setShowModal(false))
      dispatch(
        returnAlerts(
          'Overtime created successfully',
          res.status,
          'OVERTIME_CREATED',
        ),
      )
    })
    .catch((err) => {
      console.log(err)
      dispatch(returnErrors(err.response.data, err.response.status))
    })
}
