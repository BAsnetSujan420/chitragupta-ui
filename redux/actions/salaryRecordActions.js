import axios from "axios";
import { returnErrors, returnAlerts } from "./alertActions";

export const generateSalaryRecords = (date) => async(dispatch, getState) => {
  if (!date) {
    dispatch(returnErrors("Date must be present.", 422, "INVALID_ARGUMENT"))
  } else {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/generate_salary_records`,
        {
          salary_date: date,
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
        dispatch(returnErrors("Could not generate salary records", response.status))
      }
    } catch (error) {
      dispatch(returnErrors(
        error.response.data.message ||
        error.response.data.error ||
        "Couldn't generate salary records",
        error.response.status,
        error.response.statusText
      ))
    }
  }
}
