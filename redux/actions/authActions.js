import axios from 'axios'
import { returnErrors, returnAlerts, clearErrors } from './alertActions'
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  SET_TOKEN,
  UNSET_TOKEN,
  SET_IS_SERVER, SET_REDIRECT, RESET_REDIRECT,
} from './types'
import { getCaptchaScore } from "../../lib/utils";

//* set initial token on page access
export const setToken = (token) => (dispatch, getState) => {
  dispatch({ type: SET_TOKEN, payload: token })
}

// check status of server
export const serverCheck = () => (dispatch) => {
  dispatch({ type: SET_IS_SERVER })
}

//* check token and load user
export const loadUser = () => (dispatch, getState) => {
  // user loading
  dispatch({ type: USER_LOADING })

  axios
    .get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/user.json`,
      tokenConfig(getState),
    )
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data.data.attributes,
      }),
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status))
      dispatch({ type: AUTH_ERROR })
    })
}

//* log in user
export const login =
  ({ email, password }) =>
  async (dispatch) => {
    // headers
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    }
    // request body
    const body = JSON.stringify({ user: { email, password } })
    const score = await getCaptchaScore()
    if (score > 0.6) {
      axios
          .post(
              `${process.env.NEXT_PUBLIC_REMOTE_URL}/users/sign_in.json`,
              body,
              config,
          )
          .then((res) => {
            dispatch(clearErrors())
            dispatch(
                returnAlerts('Logged in successfully', res.status, 'LOGIN_SUCCESS'),
            )
            dispatch({ type: LOGIN_SUCCESS, payload: res })
            dispatch({ type: SET_TOKEN, payload: res.headers.authorization })
          })
          .catch((err) => {
            dispatch(
                returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'),
            )
            dispatch({
              type: LOGIN_FAIL,
            })
          })
    } else {
      dispatch(returnErrors("Are you a robot?", 400, "CAPTCHA_FAILED"))
    }
  }

//* logout user
export const logout = () => (dispatch, getState) => {
  axios
    .delete(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/users/sign_out.json`,
      tokenConfig(getState),
    )
    .then((res) => {
      dispatch(
        returnAlerts('Logged out successfully', res.status, 'LOGOUT_SUCCESS'),
      )
      dispatch({ type: LOGOUT_SUCCESS })
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGOUT_FAIL'),
      )
    })
}

export const invitationFormSubmit = (email) => async (dispatch, getState) => {
  try {
    const score = await getCaptchaScore();

    if (score > 0.6) {
      try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/invite.json`,
            {
              email,
            },
            { headers: { Authorization: getState().auth.token } }
        );

        if (response.statusText === "OK") {
          dispatch(returnAlerts(
              response.data && response.data.message,
              response.status
          ));
        } else {
          dispatch(returnErrors(
              response.data.message || response.data.error,
              response.status
          ));
        }
      } catch (error) {
        dispatch(returnErrors(
            error.response.data.message || error.response.data.error,
            error.response.status
        ));
      }
    } else {
      dispatch(returnErrors(
          "Are you a robot?",
          404
      ));
    }
  } catch (error) {
    dispatch(returnErrors(
        error.response.data.message || error.response.data.error,
        error.response.status
    ));
    console.log(error)
  }
}

export const acceptInvitation = (invitation_token , password, passwordConfirmation) => async (dispatch) => {
  if (password.length < 8) {
    dispatch(returnErrors(
        "Password length must be greater than 8.",
        404
    ))
    return;
  } else if (password !== passwordConfirmation) {
    dispatch(returnErrors(
        "Password and confirmation does not match...",
        404
    ))
    return;
  }

  try {
    const score = await getCaptchaScore();
    if (score > 0.6) {
      const response = await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/users/invitation.json`,
          {
            user: {
              invitation_token,
              password,
              password_confirmation: passwordConfirmation,
            },
          }
      );

      if (response.statusText === "OK") {
        // set localstorage token
        localStorage.setItem(
            "token",
            `Bearer ${response.headers.authorization}`
        );
        // set user id
        localStorage.setItem("user_id", response.data.user.id);
        // redirect to page where user will fill rest of the info
        dispatch({
          type: SET_REDIRECT,
          payload: "/users/profile_form"
        })
      } else {
        // show error message
        dispatch(returnErrors(
            "Failed to set password",
            404
        ))
      }
    }
  } catch (error) {
    dispatch(returnErrors(
        error.message,
        404
    ))
  }
}

export const resetRedirect = () => (dispatch) => {
  dispatch({
    type: RESET_REDIRECT
  })
}

//! setup config headers and token
export const tokenConfig = (getState) => {
  // get token from local storage
  const state = getState()
  // add it to the header
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
    params: {
      fetch_all: state.records.fetchAllRecords,
      page: state.records.page,
      batch: state.records.batch,
    },
  }
  // if there is a token add to header
  if (state.auth.token) {
    config.headers.Authorization = state.auth.token
  }
  return config
}
