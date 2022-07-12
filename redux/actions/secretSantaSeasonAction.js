import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'

export const createSecretSantaSeason =
  (secretSantaSeason) => async (dispatch, getState) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/secret_santa_seasons.json`,
        {
          secret_santa_season: secretSantaSeason,
        },
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )
      dispatch(
        returnAlerts(
          'Successfully created new Season',
          response.status,
          'RECORD_CREATION_SUCCESS',
        ),
      )
    } catch (error) {
      dispatch(
        returnErrors(
          error.response && error.response.data,
          error.resposne && error.response.status,
        ),
      )
    }
  }
