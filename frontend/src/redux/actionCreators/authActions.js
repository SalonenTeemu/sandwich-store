import { createNotification } from "./notificationActions.js";

const url = "http://localhost:3000/";
export const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Messages for registration and login-related notifications.
 */
export const invalidAuth = {
  name: "Username too short.",
  email: "Invalid email.",
  password: "Password too short.",
};

/**
 * Messages for various auth-related notifications.
 */
const authMsg = {
  loading: "Loading...",
  loginError: "Error with logging in.",
  logout: "Logged out.",
  logoutError: "Error with logging out.",
  register: "Registration successful.",
  registerError: "Error with registration.",
};

const validAuth = {
  welcome: function (name) {
    return `Welcome to the store, ${name}!`;
  },
  welcomeBack: "Welcome back!",
};

/**
 * Initializes authentication status.
 */
export const initAuth = () => {
  return async (dispatch) => {
    const response = await fetch(`${url}user/check-status`, {
      credentials: "include",
    });

    if (!response.ok) {
      return dispatch({
        type: "INIT_AUTH",
      });
    }

    if (response.status == 204) {
      dispatch({
        type: "GUEST_AUTH",
      });
    } else {
      const data = await response.json();
      dispatch({
        type: "INIT_AUTH",
        payload: data,
      });
    }
  };
};

/**
 * Logs in the user.
 * Dispatches actions to set the authorized user and create notifications.
 * @param {Object} logInCreds - The credentials for logging in.
 */
export const logIn = (logInCreds) => {
  return async (dispatch) => {
    if (logInCreds.username && logInCreds.username.length < 3) {
      return dispatch(createNotification("auth", invalidAuth.name, "error"));
    }

    if (logInCreds.password.length < 3) {
      return dispatch(
        createNotification("auth", invalidAuth.password, "error")
      );
    }
    dispatch(createNotification("auth", authMsg.loading, "loading"));

    const response = await fetch(`${url}user/login`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(logInCreds),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(createNotification("auth", authMsg.loginError, "error"));
    }

    dispatch({
      type: "INIT_AUTH",
      payload: data,
    });

    dispatch(createNotification("auth", validAuth.welcomeBack, "success"));
  };
};

/**
 * Logs out the user.
 * Dispatches actions to create notifications and to clear the authorized user, users and orders lists.
 */
export const logOut = () => {
  return async (dispatch) => {
    dispatch(createNotification("auth", authMsg.loading, "loading"));
    const response = await fetch(`${url}user/logout`, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return dispatch(createNotification("auth", authMsg.logoutError, "error"));
    }

    dispatch({ type: "REMOVE_AUTH" });
    dispatch({ type: "CLEAR_ORDERS" });
    dispatch({ type: "CLEAR_USERS" });
    dispatch(createNotification("auth", authMsg.logout, "success"));
  };
};

/**
 * Registers a new user.
 * Dispatches actions to set the authorized user and create notifications.
 * @param {Object} registerCreds - The credentials for registration.
 */
export const register = (registerCreds) => {
  return async (dispatch) => {
    if (registerCreds.username && registerCreds.username.length < 3) {
      return dispatch(createNotification("auth", invalidAuth.name, "error"));
    }

    if (!RegExp(validEmailRegex).test(registerCreds.email)) {
      return dispatch(createNotification("auth", invalidAuth.email, "error"));
    }

    if (registerCreds.password.length < 3) {
      return dispatch(
        createNotification("auth", invalidAuth.password, "error")
      );
    }

    dispatch(createNotification("auth", authMsg.loading, "loading"));

    const response = await fetch(`${url}user/register`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(registerCreds),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(
        createNotification("auth", authMsg.registerError, "error")
      );
    }

    dispatch({
      type: "INIT_AUTH",
      payload: data,
    });

    return dispatch(
      createNotification("auth", validAuth.welcome(data.username), "success")
    );
  };
};
