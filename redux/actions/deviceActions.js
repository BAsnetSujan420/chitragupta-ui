import React from 'react'
import axios from 'axios'
import { returnAlerts, returnErrors } from './alertActions'

export const createDevice = (device) => async (dispatch, getState) => {
  const formData = new FormData()

  for (const field in device) {
    formData.append(`device[${field}]`, device[field])
  }
  formData.append('device[image]', document.querySelector('#image').files[0])
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/devices.json`,
      formData,
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

export const remoteUpdateDevice = (device) => async (dispatch, getState) => {
  const formData = new FormData()

  for (const field in device) {
    formData.append(`device[${field}]`, device[field])
  }
  formData.append('device[image]', document.querySelector('#image').files[0])
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/devices/${device.id}.json`,
      formData,
      {
        headers: {
          Authorization: getState().auth.token,
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    dispatch(
      returnAlerts(
        'Successfully updated device',
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

export const remoteDestroyDevice = (device) => async (dispatch, getState) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/devices/${device.id}.json`,
      {
        headers: {
          Authorization: getState().auth.token,
        },
      },
    )
    console.log(response)
    dispatch(
      returnAlerts(
        'Successfully deleted device',
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
