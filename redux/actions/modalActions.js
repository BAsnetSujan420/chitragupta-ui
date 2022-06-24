import { SET_NEW_MODAL, SET_UDPATE_MODAL } from "./types";

export const setNewModal = (state) => (dispatch) => {
  dispatch({ type: SET_NEW_MODAL, payload: state })
}
export const setUpdateModal = (state) => (dispatch) => {
  dispatch({ type: SET_UDPATE_MODAL, payload: state })
}
