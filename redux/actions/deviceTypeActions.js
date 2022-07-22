import React from 'react'
import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'

export const createDeviceType = (deviceType) => async (dispatch, getState) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_types.json`,
      {
        device_type: deviceType,
      },
      {
        headers: {
          Authorization: getState().auth.token,
        },
      },
    )
    dispatch(
      returnAlerts(
        'Successfully created new device type',
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

export const remoteUpdateDeviceType =
  (deviceType) => async (dispatch, getState) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_types/${deviceType.id}.json`,
        {
          device_type: deviceType,
        },
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )
      dispatch(
        returnAlerts(
          'Successfully updated device type',
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

export const remoteDestroyDeviceType =
  (deviceType) => async (dispatch, getState) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_types/${deviceType.id}.json`,
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )
      dispatch(
        returnAlerts(
          'Successfully deleted device type',
          response.status,
          'RECORD_DELETION_SUCCESS',
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
