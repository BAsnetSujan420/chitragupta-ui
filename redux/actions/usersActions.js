import axios from 'axios'
import Jsona from 'jsona'

import { USERS_LOADING, GET_RECORDS, GET_USER } from './types'
import { tokenConfig } from './authActions'
import { returnErrors } from './alertActions'

const dataFormatter = new Jsona()

export const setLoadingState = (state) => (dispatch) => {
  dispatch({ type: USERS_LOADING, payload: state })
}

// load users
export const fetchUsers = () => (dispatch, getState) => {
  dispatch(setLoadingState(true))
  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users.json`,
      tokenConfig(getState),
    )
    .then((res) => {
      dispatch({
        type: GET_RECORDS,
        payload: res.data,
      })
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response && err.response.data,
          err.response && err.response.status,
        ),
      )
    })
}

// load single user
export const fetchUser = (user_id) => (dispatch, getState) => {
  dispatch(setLoadingState(true))
  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users/${user_id}.json`,
      tokenConfig(getState),
    )
    .then((res) => {
      dispatch({
        type: GET_USER,
        payload: dataFormatter.deserialize(res.data),
      })
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response && err.response.data,
          err.response && err.response.status,
        ),
      )
    })
}
