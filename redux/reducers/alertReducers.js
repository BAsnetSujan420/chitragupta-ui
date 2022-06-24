import { GET_ERRORS_ALERT, CLEAR_ALERTS, GET_SUCCESS_ALERT } from '../actions/types'

const initialState = {
    message: null,
    status: null,
    id: null,
    type: null
}
export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS_ALERT:
            return {
                message: action.payload.message,
                status: action.payload.status,
                id: action.payload.id,
                type: "error"
            }
        case GET_SUCCESS_ALERT:
            return {
                message: action.payload.message,
                status: action.payload.status,
                id: action.payload.id,
                type: "success"
            }

        case CLEAR_ALERTS:
            return {
                message: null,
                status: null,
                id: null,
                type:null
            }
        default:
            return state
    }
}
