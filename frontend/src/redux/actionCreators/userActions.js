import { createNotification } from "./notificationActions.js";
import { validEmailRegex, invalidAuth } from "./authActions.js";

const url = "http://localhost:3000/";

/**
 * Messages for various user-related notifications.
 */
const userMsg = {
  loading: "Loading...",
  loaded: "User(s) loaded successfully.",
  loadedError: "Error with loading user(s).",
  edited: "User edited successfully.",
  editedError: "Error with editing user.",
  deleted: "User deleted successfully.",
  deletedError: "Error with deleting user.",
};

/**
 * Retrieves users from the server.
 * Dispatches actions to update current users and create notifications.
 */
export const getUsers = () => {
  return async (dispatch) => {
    dispatch(createNotification("user", userMsg.loading, "loading"));
    const response = await fetch(`${url}user/`, { credentials: "include" });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(createNotification("user", userMsg.loadedError, "error"));
    }

    dispatch({
      type: "GET_USERS",
      payload: data,
    });
    dispatch(createNotification("user", userMsg.loaded, "success"));
  };
};

/**
 * Retrieves a specific user by its username from the server.
 * Dispatches actions to update current users and create notifications.
 * @param {string} username- The username of the user to retrieve.
 */
export const getUserByUsername = (username) => {
  return async (dispatch) => {
    dispatch(createNotification("user", userMsg.loading, "loading"));
    const response = await fetch(`${url}user/${username}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(createNotification("user", userMsg.loadedError, "error"));
    }

    dispatch({
      type: "GET_USER",
      payload: data,
    });
    dispatch(createNotification("user", userMsg.loaded, "success"));
  };
};

/**
 * Edits an existing user on the server.
 * Dispatches actions to update current users and create notifications.
 * @param {Object} userToUpdate - The updated user object.
 */
export const editUser = (userToUpdate) => {
  return async (dispatch) => {
    if (userToUpdate.username && userToUpdate.username.length < 3) {
      return dispatch(createNotification("auth", invalidAuth.name, "error"));
    }

    if (!RegExp(validEmailRegex).test(userToUpdate.email)) {
      return dispatch(createNotification("auth", invalidAuth.email, "error"));
    }

    if (userToUpdate.password) {
      if (userToUpdate.password.length < 3) {
        return dispatch(
          createNotification("auth", invalidAuth.password, "error")
        );
      }
    }
    dispatch(createNotification("user", userMsg.loading, "loading"));
    const response = await fetch(`${url}user/${userToUpdate.username}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify(userToUpdate),
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
            "user",
            `User with email ${userToUpdate.email} already exists.`,
            "error"
          )
        );
      }
      return dispatch(createNotification("user", userMsg.editedError, "error"));
    }

    dispatch({
      type: "EDIT_USER",
      payload: data,
    });
    dispatch(createNotification("user", userMsg.edited, "success"));
  };
};

/**
 * Deletes an user from the server.
 * Dispatches actions to update current users and create notifications.
 * If own account is deleted, removes the auth state.
 * @param {string} username - The username of the user to delete.
 * @param {string} authUsername - The username of the authorized user.
 */
export const deleteUser = (username, authUsername) => {
  return async (dispatch) => {
    dispatch(createNotification("user", userMsg.loading, "loading"));
    const response = await fetch(`${url}user/${username}`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return dispatch(
        createNotification("user", userMsg.deletedError, "error")
      );
    }

    dispatch({
      type: "DELETE_USER",
      payload: username,
    });
    dispatch(createNotification("user", userMsg.deleted, "success"));

    if (username === authUsername) {
      dispatch({ type: "REMOVE_AUTH" });
      dispatch({ type: "CLEAR_ORDERS" });
      dispatch({ type: "CLEAR_USERS" });
    }
  };
};
