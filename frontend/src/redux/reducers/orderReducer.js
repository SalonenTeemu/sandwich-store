const orderReducer = (state = [], action) => {
  let index;
  let newState;

  switch (action.type) {
    case "GET_ORDER":
      index = state.findIndex((order) => order.id === action.payload.id);
      newState = [...state];

      if (index !== -1) {
        newState[index] = action.payload;
        return newState;
      }
      return [...state, action.payload];

    case "GET_ORDERS":
      return [...action.payload];

    case "CLEAR_ORDERS":
      return [];

    case "ADD_ORDER":
      return [...state, action.payload];

    default:
      return state;
  }
};

export default orderReducer;
