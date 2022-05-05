import axios from "axios";
import {
  GET_ERRORS,
  ADD_NOTIFY,
  GET_NOTIFIES,
  DELETE_NOTIFIY,
  DELETE_NOTIFIIES,
} from "./actionsTypes";

export const addNewNotification = (notifyData) => (dispatch) => {
  axios
    .post("notify", notifyData)
    .then((res) => {
      dispatch({
        type: ADD_NOTIFY,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getNotifications = () => (dispatch) => {
  axios
    .get("notify")
    .then((res) => {
      dispatch({
        type: GET_NOTIFIES,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_NOTIFIES,
        payload: [],
      });
    });
};

export const deleteNotification = (notificationID) => (dispatch) => {
  axios
    .post("notify/delete", { notificationID })
    .then((res) => {
      dispatch({
        type: DELETE_NOTIFIY,
        payload: notificationID,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const clearNotification = () => (dispatch) => {
  axios
    .post("notify/clear")
    .then((res) => {
      dispatch({
        type: DELETE_NOTIFIIES,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
