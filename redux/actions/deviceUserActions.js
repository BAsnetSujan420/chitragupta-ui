import React from 'react'
import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'

export const createDeviceUser = (deviceUser) => async (dispatch, getState) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_users.json`,
      {
        device_user: deviceUser,
      },
      {
        headers: {
          Authorization: getState().auth.token,
        },
      },
    )
    dispatch(
      returnAlerts(
        'Successfully created new device user',
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

export const remoteUpdateDeviceUser =
  (deviceUser) => async (dispatch, getState) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_users/${deviceUser.id}.json`,
        {
          device_user: deviceUser,
        },
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )
      dispatch(
        returnAlerts(
          'Successfully updated a device user',
          response.status,
          'RECORD_UPDATION_SUCCESS',
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
