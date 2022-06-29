import {
  GET_ERRORS_ALERT,
  CLEAR_ALERTS,
  GET_SUCCESS_ALERT
} from "./types"
// RETURN ERRORS
export const returnErrors = (message, status, id = null) => {
    console.log(message)
    message = status === 500 ? 'Internal Server Error' : message
    // debugger
    return {
        type: GET_ERRORS_ALERT,
        payload: {
            message, status, id
        }
    }
}

// RETURN ALERTS
export const returnAlerts = (message, status, id = null) => ({
    type: GET_SUCCESS_ALERT,
    payload: { message, status, id }
  })

// CLEAR ERRORS
export const clearErrors = () => ({
    type: CLEAR_ALERTS
  })
