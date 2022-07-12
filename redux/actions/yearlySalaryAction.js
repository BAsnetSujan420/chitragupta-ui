import axios from 'axios'
import { returnErrors, returnAlerts } from './alertActions'

export const generateYearlySalary = (fiscal_year) => async (dispatch, getState) => {
  if (!fiscal_year) {
    dispatch(returnErrors('Fiscal Year must be present.', 422, 'INVALID_ARGUMENT'))
  } else {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/generate_yearly_salary_records`,
        {
          fiscal_year: fiscal_year,
        },
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )

      if (response.statusText === 'OK') {
        dispatch(returnAlerts(response.data.message, response.status))
      } else {
        dispatch(
          returnErrors('Could not generate yearly salary records', response.status),
        )
      }
    } catch (error) {
      dispatch(
        returnErrors(
          error.response.data.message ||
            error.response.data.error ||
            "Couldn't generate yearly salary records",
          error.response.status,
          error.response.statusText,
        ),
      )
    }
  }
}
