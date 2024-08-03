import { errorHandler } from "./error.handler.js";
import jwt from "jsonwebtoken";

export const adminAuthorization = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }
      if (decodedToken && decodedToken._doc.role === "admin") {
        req.user = decodedToken._doc;
        next();
      } else {
        next(errorHandler(403, "Forbidden"));
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const managerAuthorization = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }
      if (decodedToken && decodedToken._doc.role === "manager") {
        req.user = decodedToken._doc;
        next();
      } else {
        next(errorHandler(403, "Forbidden"));
      }
    });
  } catch (error) {
    next(error);
  }
};

export const userAuthorization = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {

      if (err) {
        return next(errorHandler(403, "Forbidden"));
      }

      if (decodedToken) {
        req.user = decodedToken._doc;
        next();
      } else {
        next(errorHandler(403, "Forbidden"));
      }
    });
  } catch (error) {
    next(error);
  }
};
