import { createNotification } from "./notificationActions.js";

const url = "http://localhost:3000/";

/**
 * Messages for various sandwich-related notifications.
 */
const sandwichMsg = {
  loading: "Loading...",
  loaded: "Sandwich(es) loaded successfully.",
  loadedError: "Error with loading sandwich(es).",
  added: "New sandwich added successfully.",
  addedError: "Error with adding a new sandwich.",
  edited: "Sandwich edited successfully.",
  editedError: "Error with editing sandwich.",
  deleted: "Sandwich deleted successfully.",
  deletedError: "Error with deleting sandwich.",
};

/**
 * Retrieves sandwiches from the server.
 * Dispatches actions to update current sandwiches and create notifications.
 */
export const getSandwiches = () => {
  return async (dispatch) => {
    dispatch(createNotification("sandwich", sandwichMsg.loading, "loading"));
    const response = await fetch(`${url}sandwich/`, { credentials: "include" });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(
        createNotification("sandwich", sandwichMsg.loadedError, "error")
      );
    }

    dispatch({
      type: "GET_SANDWICHES",
      payload: data,
    });
    dispatch(createNotification("sandwich", sandwichMsg.loaded, "success"));
  };
};

/**
 * Retrieves a specific sandwich by its ID from the server.
 * Dispatches actions to update current sandwiches and create notifications.
 * @param {number} sandwichId - The ID of the sandwich to retrieve.
 */
export const getSandwichById = (sandwichId) => {
  return async (dispatch) => {
    dispatch(createNotification("sandwich", sandwichMsg.loading, "loading"));
    const response = await fetch(`${url}sandwich/${sandwichId}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(
        createNotification("sandwich", sandwichMsg.loadedError, "error")
      );
    }

    dispatch({
      type: "GET_SANDWICH",
      payload: data,
    });
    dispatch(createNotification("sandwich", sandwichMsg.loaded, "success"));
  };
};

/**
 * Adds a new sandwich to the server.
 * Dispatches actions to update current sandwiches and create notifications.
 * @param {Object} sandwichToAdd - The new sandwich object to be added.
 */
export const addSandwich = (sandwichToAdd) => {
  return async (dispatch) => {
    dispatch(createNotification("sandwich", sandwichMsg.loading, "loading"));
    const response = await fetch(`${url}sandwich/`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(sandwichToAdd),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status == 409) {
        return dispatch(
          createNotification(
            "sandwich",
            `Sandwich with name ${sandwichToAdd.name} already exists.`,
            "error"
          )
        );
      }
      return dispatch(
        createNotification("sandwich", sandwichMsg.addedError, "error")
      );
    }

    dispatch({
      type: "ADD_SANDWICH",
      payload: data,
    });
    dispatch(createNotification("sandwich", sandwichMsg.added, "success"));
  };
};

/**
 * Edits an existing sandwich on the server.
 * Dispatches actions to update current sandwiches and create notifications.
 * @param {Object} sandwichToUpdate - The updated sandwich object.
 */
export const editSandwich = (sandwichToUpdate) => {
  return async (dispatch) => {
    dispatch(createNotification("sandwich", sandwichMsg.loading, "loading"));
    const response = await fetch(`${url}sandwich/${sandwichToUpdate.id}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify(sandwichToUpdate),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status == 409) {
        return dispatch(
          createNotification(
            "sandwich",
            `Sandwich with name ${sandwichToUpdate.name} already exists.`,
            "error"
          )
        );
      }
      return dispatch(
        createNotification("sandwich", sandwichMsg.editedError, "error")
      );
    }

    dispatch({
      type: "EDIT_SANDWICH",
      payload: data,
    });
    dispatch(createNotification("sandwich", sandwichMsg.edited, "success"));
  };
};

/**
 * Deletes a sandwich from the server.
 * Dispatches actions to update current sandwiches and create notifications.
 * @param {number} sandwichId - The ID of the sandwich to delete.
 */
export const deleteSandwich = (sandwichId) => {
  return async (dispatch) => {
    dispatch(createNotification("sandwich", sandwichMsg.loading, "loading"));
    const response = await fetch(`${url}sandwich/${sandwichId}`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return dispatch(
        createNotification("sandwich", sandwichMsg.deletedError, "error")
      );
    }

    dispatch({
      type: "DELETE_SANDWICH",
      payload: sandwichId,
    });
    dispatch(createNotification("sandwich", sandwichMsg.deleted, "success"));
  };
};
