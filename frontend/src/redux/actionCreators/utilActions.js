const url = "http://localhost:3000/";

/**
 * Retrieves toppings and bread types from the server.
 * Dispatches an action to set the retrieved data in the Redux store.
 */
export const getToppingsAndBreadTypes = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${url}sandwich/sandwichUtils`, {
        credentials: "include",
      });
      const data = await response.json();
      dispatch({ type: "SET_TOPPINGS_AND_BREADTYPES", payload: data });
    } catch (error) {
      console.error("Error fetching toppings data:", error);
    }
  };
};
