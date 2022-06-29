import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    SET_TOKEN,
    SET_REDIRECT,
    RESET_REDIRECT,
} from '../actions/types'

const initialState = {
    token: null,
    isAuthenticated: null,
    isLoading: false,
    user: null,
    verify_token: false,
    redirect: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload
            }
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                verify_token: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.headers.authorization);
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false
            }

        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case AUTH_ERROR:
            localStorage.removeItem('token')
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                user: null,
                isLoading: false,
                verify_token: false
            }
        case SET_REDIRECT:
            return {
                ...state,
                redirect: action.payload
            }
        case RESET_REDIRECT:
            return {
                ...state,
                redirect: null
            }

        default:
            return state
    }
}
