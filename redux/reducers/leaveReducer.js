import {
  GET_LEAVE_REQUESTS,
  ADD_LEAVE_REQUEST,
  UPDATE_LEAVE_REQUEST,
  SET_SELECTED_LEAVE,
  SHOW_LEAVE_MODAL,
  LEAVE_REQUESTS_LOADING
} from "../actions/types";

const initialState = {
  loading: false,
  selectedLeave: {},
  leaveModal: false
}
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_LEAVE_REQUEST:
      return{
        ...state, items: [...state.items, action.payload], loading: false
      }
    case GET_LEAVE_REQUESTS:
      return { ...state, items: action.payload, loading: false }
    case SET_SELECTED_LEAVE:
      return { ...state, selectedLeave: action.payload, loading: false }
    case UPDATE_LEAVE_REQUEST:
      return {
        ...state,
        loading: false
      }
    case SHOW_LEAVE_MODAL:
      return {
        ...state,
        leaveModal: action.payload
      }
    case LEAVE_REQUESTS_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state;
  }
};
