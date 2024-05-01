const sandwichReducer = (state = [], action) => {
  let index;
  let newState;

  switch (action.type) {
    case "GET_SANDWICH":
      index = state.findIndex((sandwich) => sandwich.id === action.payload.id);
      newState = [...state];

      if (index !== -1) {
        newState[index] = action.payload;
        return newState;
      }
      return [...state, action.payload];

    case "GET_SANDWICHES":
      return [...action.payload];

    case "ADD_SANDWICH":
      return [...state, action.payload];

    case "EDIT_SANDWICH":
      index = state.findIndex((sandwich) => sandwich.id === action.payload.id);
      if (index !== -1) {
        newState = [...state];
        newState[index] = action.payload;
        return newState;
      }
      return state;

    case "DELETE_SANDWICH":
      index = state.findIndex(
        (sandwich) => sandwich.id === parseInt(action.payload)
      );
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

export default sandwichReducer;
