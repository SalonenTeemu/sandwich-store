const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { writeJson, respondWithCode } = require("../utils/writer.js");
const UserModel = require("../models/userModel.js");

const env = process.env;
const JWT_SECRET = env.JWT_SECRET;

/**
 * Encrypts a password using bcrypt hashing algorithm.
 * @param {string} password - The password to be encrypted.
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 */
async function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        console.error("Error in password encryption:", err);
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password to be compared.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} A Promise that resolves to true if passwords match, false otherwise.
 */
async function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        console.error("Error in password comparison", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Authenticates a user by comparing the provided password with stored hashed password.
 * @param {Object} user - The user object.
 * @param {string} password - The password to compare against the hashed password.
 * @returns {Promise<boolean>} A promise that resolves to a boolean of the password match.
 */
async function authenticate(user, password) {
  const passwordMatch = await comparePassword(password, user.password_hash);
  return passwordMatch;
}
/**
 * Verifies the authenticity of a JSON Web Token (JWT) using the provided secret.
 * @param {string} token - The JWT to be verified.
 * @returns {Object} If the token is valid, returns the payload decoded from the token, else null.
 */
function verifyToken(token) {
  try {
    const decodedToken = decodeURIComponent(token);
    const payload = jwt.verify(decodedToken, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves the current user based on the provided request's token.
 * If the token is valid and corresponds to an existing user, sets the user on the request object.
 * If the token is invalid or corresponds to an unknown user, clears the token cookie and sends error response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves once user has been retrieved.
 */
async function getCurrentUser(req, res, next) {
  try {
    const cookieOptions = { ...res.app.get("cookieOptions"), signed: true };
    const token = req.signedCookies.token;
    if (!token) {
      return next();
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      res.clearCookie("token", cookieOptions);
      return writeJson(res, respondWithCode(403, { message: "Invalid token" }));
    }
    const user = await UserModel.getUserByName(decodedToken.username);
    if (!user) {
      res.clearCookie("token", cookieOptions);
      return writeJson(res, respondWithCode(403, { message: "Unknown user" }));
    }
    req.user = user;
    signToken(res, user);
    next();
  } catch (error) {
    console.log(error);
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Signs a JSON Web Token containing user information and sets it as a cookie in the response.
 * @param {Object} res - The response object.
 * @param {Object} user - The user object containing information.
 */
function signToken(res, user) {
  const token = jwt.sign(
    { username: user.username, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const encodedToken = encodeURIComponent(token);
  res.cookie("token", encodedToken, { ...res.app.get("cookieOptions"), signed: true });
}

/**
 * Clears the token cookie from the response if a user is present in the request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 **/
function clearCookieToken(req, res) {
  if (req.user) {
    res.clearCookie("token", {
      ...res.app.get("cookieOptions"),
      signed: true,
      maxAge: 0,
    });
  }
}

/**
 * Middleware function to protect routes by checking that a user is logged in.
 * If no user is present in the request, it sends a 401 Unauthorized response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function protect (req, res, next) {
  if (!req.user) {
    return writeJson(res, respondWithCode(401, { message: "Login required" }));
  }
  next();
}

/**
 * Middleware function to protect routes by checking that the user is logged in and has an 'admin' role.
 * If no user is present in the request, it sends a 401 Unauthorized response.
 * If the user's role is not 'admin', it sends a 403 Forbidden response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function protectAdmin(req, res, next) {
  if (!req.user) {
    return writeJson(res, respondWithCode(401, { message: "Login required" }));
  }
  if (req.user.role !== 'admin') {
    return writeJson(res, respondWithCode(403, { message: "Admin role required" }));
  }
  next();
}

module.exports = {
  encryptPassword,
  comparePassword,
  authenticate,
  getCurrentUser,
  signToken,
  clearCookieToken,
  protect,
  protectAdmin
};
