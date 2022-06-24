import { GET_USER } from '../actions/types'

const initialState = {
  loading: false,
  user: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}
