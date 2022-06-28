import React from 'react'
import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'

export const createDevice = (device) => async (dispatch, getState) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/devices.json`,
      {
        device: {
          ...device,
          device_type_attributes: device_type,
        },
      },
      {
        headers: {
          Authorization: getState().auth.token,
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    dispatch(
      returnAlerts(
        'Successfully created new device',
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
