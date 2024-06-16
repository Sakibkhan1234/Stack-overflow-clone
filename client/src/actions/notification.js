import * as api from "../api/index";

export const sendNotification = (notificationData) => async (dispatch) => {
  try {
    const { data } = await api.sendNotification(notificationData);
    dispatch({ type: "SEND_NOTIFICATION", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getNotifications(userId);
    dispatch({ type: "GET_NOTIFICATIONS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const markAsRead = (id) => async (dispatch) => {
  try {
    const { data } = await api.markAsRead(id);
    dispatch({ type: "MARK_AS_READ", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = (id) => async (dispatch) => {
  try {
    await api.deleteNotification(id);
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  } catch (error) {
    console.error(error);
  }
};


