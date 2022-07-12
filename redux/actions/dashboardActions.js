import axios from 'axios'
import { returnErrors, clearErrors } from './alertActions'
import { tokenConfig } from './authActions'
import {
  SET_FETCH_ALL_RECORDS,
  SET_PAGE,
  SET_BATCH,
  LEAVE_REQUESTS_LOADING,
  GET_RECORDS,
  SHOW_MODAL
} from './types'

export const setShowModal = (modal) => (dispatch) => {
  dispatch(clearErrors())
  dispatch({ type: SHOW_MODAL, payload: modal })
}

export const setFetchAllRecords = (fetchAll) => (dispatch) => {
  dispatch({ type: SET_FETCH_ALL_RECORDS, payload: fetchAll })
}

export const setPage = (page) => (dispatch) => {
  dispatch({ type: SET_PAGE, payload: page })
}

export const setBatch = (batch) => (dispatch) => {
  dispatch({ type: SET_BATCH, payload: batch })
}

export const fetchRecords = (fetchFunction) => (dispatch) => {
  dispatch(fetchFunction())
}

export const setLoadingState = (state) => (dispatch) => {
  dispatch({ type: LEAVE_REQUESTS_LOADING, payload: state })
}

export const fetchSalaries = () => (dispatch, getState) => {
  dispatch(setLoadingState(true))

  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salaries.json`,
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
          err.resposne && err.response.status,
        ),
      )
    })
}

export const fetchAllSalaries = () => (dispatch) => {
  dispatch(setBatch(null))
  dispatch(setPage(null))
  dispatch(fetchSalaries())
}

export const fetchSalarySettings = () => (dispatch, getState) => {
  dispatch(setLoadingState(true))

  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings.json`,
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

export const fetchSalaryRecords = () => (dispatch, getState) => {
  dispatch(setLoadingState(true))

  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_records.json`,
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

export const fetchOvertimes = () => (dispatch, getState) => {
  dispatch(setLoadingState(true))

  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/overtimes.json`,
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

export const fetchYearlySalary = () => (dispatch, getState) => {
  dispatch(setLoadingState(true))

  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/yearly_salary_records.json`,
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
