export const createNotification = (type, message, status) => {
  return {
    type: "ADD_NOTIFICATION",
    payload: {
      type,
      message,
      status,
    },
  };
};

export const removeNotification = (type) => {
  return {
    type: "REMOVE_NOTIFICATION",
    payload: {
      type,
    },
  };
};
