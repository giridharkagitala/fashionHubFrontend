import {
    BACKORDER_CREATE_REQUEST,
    BACKORDER_CREATE_SUCCESS,
    BACKORDER_CREATE_FAILURE,
    BACKORDER_FETCH_REQUEST,
    BACKORDER_FETCH_SUCCESS,
    BACKORDER_FETCH_FAILURE,
  } from "./ActionType";
  import axios from "axios";
  
  // Action to create a backorder
  export const createBackorder = (data, jwt) => async (dispatch) => {
    try {
      dispatch({ type: BACKORDER_CREATE_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      };
  
      const response = await axios.post(
        "/api/backorders",
        {
          productId: data.productId,
          userId: data.userId,
          quantity: data.quantity,
        },
        config
      );
  
      dispatch({
        type: BACKORDER_CREATE_SUCCESS,
        payload: response.data,
      });
  
      // Optional: Show a success message (if a toast system is implemented)
      // toast.success("Backorder created successfully!");
    } catch (error) {
      dispatch({
        type: BACKORDER_CREATE_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
  
      // Optional: Show an error message (if a toast system is implemented)
      // toast.error("Failed to create backorder.");
    }
  };


  export const getUserBackorders = (jwt) => async (dispatch) => {
    try {
      dispatch({ type: BACKORDER_FETCH_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
  
      const response = await axios.get("/api/backorders/user", config);
  
      dispatch({
        type: BACKORDER_FETCH_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: BACKORDER_FETCH_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  