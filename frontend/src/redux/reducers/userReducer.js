const userReducer = (state = [], action) => {
  let index;
  let newState;

  switch (action.type) {
    case "GET_USER":
      index = state.findIndex((user) => user.id === action.payload.id);
      newState = [...state];

      if (index !== -1) {
        newState[index] = action.payload;
        return newState;
      }
      return [...state, action.payload];

    case "GET_USERS":
      return [...action.payload];

    case "CLEAR_USERS":
      return [];

    case "ADD_USER":
      return [...state, action.payload];

    case "EDIT_USER":
      index = state.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        newState = [...state];
        newState[index] = action.payload;
        return newState;
      }
      return state;

    case "DELETE_USER":
      index = state.findIndex((user) => user.username === action.payload);
      if (index !== -1) {
        newState = [...state];
        newState.splice(index, 1);
        return newState;
      }
      return state;

    default:
      return state;
  }
};

export default userReducer;
