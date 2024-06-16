const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case "SEND_NOTIFICATION":
      return [...state, action.payload];
    case "GET_NOTIFICATIONS":
      return action.payload;
    case "MARK_AS_READ":
      return state.map((notification) =>
        notification._id === action.payload._id ? action.payload : notification
      );
    case "DELETE_NOTIFICATION":
      return state.filter((notification) => notification._id !== action.payload);
    default:
      return state;
  }
};

export default notificationsReducer;


  

