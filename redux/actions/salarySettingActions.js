import axios from "axios";
import {returnAlerts, returnErrors} from "./alertActions";

export const createNewSalarySetting = (salarySetting, taxRules) => async (dispatch, getState) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings.json`,
      {
        salary_setting: {
          ...salarySetting,
          tax_rules_attributes: taxRules,
        },
      },
      {
        headers: {
          Authorization: getState().auth.token,
        },
      },
    )

    if (response.statusText === 'OK') {
      dispatch(returnAlerts("Successfully created new salary setting.", response.status))
    } else {
      dispatch(returnErrors(response.data.message || response.data.error, response.status, response.statusText))
    }
  } catch (error) {
    dispatch(returnErrors(error.response.data?.message || error.response.data?.error, error.response.status, error.response.statusText))
  }
}

export const remoteUpdateSalarySetting = (salarySetting, taxRules) => async (dispatch, getState) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings/${salarySetting.id}.json`,
      {
        salary_setting: {
          ...salarySetting,
          tax_rules_attributes: taxRules,
        },
      },
      {
        headers: {
          Authorization: getState().auth.token,
        },
      },
    )

    if (response.statusText === 'OK') {
      dispatch(returnAlerts("Successfully updated salary setting.", response.status))
    } else {
      dispatch(returnErrors(response.data.message || response.data.error, response.status, response.statusText))
    }
  } catch (error) {
    dispatch(returnErrors(error.response.data?.message || error.response.data?.error, error.response.status, error.response.statusText))
  }
}