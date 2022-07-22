import React from 'react'
import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'

export const createDeviceManager =
  (deviceManager) => async (dispatch, getState) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_managers.json`,
        {
          device_manager: deviceManager,
        },
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )
      dispatch(
        returnAlerts(
          'Successfully created new device manager',
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

export const remoteUpdateDeviceManager =
  (deviceManager) => async (dispatch, getState) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_managers/${deviceManager.id}.json`,
        {
          device_manager: deviceManager,
        },
        {
          headers: {
            Authorization: getState().auth.token,
          },
        },
      )
      dispatch(
        returnAlerts(
          'Successfully updated a device manager',
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
