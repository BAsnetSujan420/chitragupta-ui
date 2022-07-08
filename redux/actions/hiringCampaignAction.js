import axios from "axios";
import {returnAlerts, returnErrors} from "./alertActions";

export const createNewHiringCampaign = (hiringCampaign) => async (dispatch, getState) => {
  try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/hiring_campaign`,
          {
            hiring_campaign: {
              ...hiringCampaign,
            },
          },
          {
            headers: {
              Authorization: getState().auth.token
            },
          },
        )

        window.location.reload()
        if (response.statusText === 'OK') {
          dispatch(returnAlerts("Successfully created new hiring campaign.", response.status))
        } else {
          dispatch(returnErrors(response.data.message || response.data.error, response.status, response.statusText))
        }
      }
  catch (error) {
    dispatch(returnErrors(error.response.data?.message || error.response.data?.error, error.response.status, error.response.statusText))
  }
}

export const remoteUpdateHiringCampaign = (hiringCampaign) => async (dispatch, getState) => {
  try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/hiring_campaign/${hiringCampaign.id}.json`,
          {
            hiring_campaign: {
              ...hiringCampaign,
            },
          },
          {
            headers: {
              Authorization: getState().auth.token
            },
          },
        )
        window.location.reload()
        if (response.statusText === 'OK') {
          dispatch(returnAlerts("Successfully update new hiring campaign.", response.status))
        } else {
          dispatch(returnErrors(response.data.message || response.data.error, response.status, response.statusText))
        }
      }
  catch (error) {
    dispatch(returnErrors(error.response.data?.message || error.response.data?.error, error.response.status, error.response.statusText))
  }
}

