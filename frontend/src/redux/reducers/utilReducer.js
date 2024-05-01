const initialState = {
  toppings: null,
  breadTypes: null,
};

const utilReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOPPINGS_AND_BREADTYPES":
      return {
        toppings: action.payload.toppings,
        breadTypes: action.payload.breadTypes,
      };
    default:
      return state;
  }
};

export default utilReducer;
