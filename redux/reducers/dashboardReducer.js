import {
  LOADING,
  LOADED,
  GET_RECORDS,
  SET_FETCH_ALL_RECORDS,
  SET_PAGE,
  SET_BATCH,
} from "../actions/types";
import Jsona from "jsona";

const dataFormatter = new Jsona();

const initialState = {
  loading: false,
  records: [],
  total: 0,
  fetchAllRecords: false,
  page: 1,
  batch: 10,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case LOADED:
      return {
        ...state,
        loading: false,
      };
    case GET_RECORDS:
      return {
        ...state,
        records: [...dataFormatter.deserialize(action.payload.data)],
        loading: false,
        total: action.payload.total,
      };
    case SET_FETCH_ALL_RECORDS:
      // reset page and batch when toggling fetch all records
      return { ...state, fetchAllRecords: action.payload, page: 1, batch: 10 };
    case SET_PAGE:
      return { ...state, page: action.payload };
    case SET_BATCH:
      return { ...state, page: action.payload };
    default:
      return state;
  }
}