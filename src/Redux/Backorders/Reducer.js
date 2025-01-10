// reducer.js
import {
  BACKORDER_CREATE_REQUEST,
  BACKORDER_CREATE_SUCCESS,
  BACKORDER_CREATE_FAILURE,
  BACKORDER_FETCH_REQUEST,
  BACKORDER_FETCH_SUCCESS,
  BACKORDER_FETCH_FAILURE,

} from "./ActionType";

const initialState = {
  loading: false,
  backorder: null,
  backorders: [],
  error: null,
};

export const backorderReducer = (state = initialState, action) => {
  switch (action.type) {
    case BACKORDER_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case BACKORDER_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        backorder: action.payload,
      };
    case BACKORDER_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case BACKORDER_FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case BACKORDER_FETCH_SUCCESS:
      return { ...state, loading: false, backorders: action.payload };
    case BACKORDER_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };


    default:
      return state;
  }
};
