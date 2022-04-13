import * as express from "express";
import { StatusCodes } from "http-status-codes";
import { auth } from "../services/firebase";
import { makeResponse } from "./helpers";


export const useAuthorization = async (req: any, res: express.Response, next: () => any) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return makeResponse(res, {
      status: StatusCodes.UNAUTHORIZED,
      error: "Unauthorized: Invalid bearer token",
    });
  }

  try {
    const idToken = authorization.split("Bearer ")[1];
    req.decodedToken = await auth.verifyIdToken(idToken);
    return next();
  } catch (error) {
    return makeResponse(res, { status: StatusCodes.INTERNAL_SERVER_ERROR, error });
  }
};


export const useHasRequiredFields = (fields: string[]) => (req: any, res: express.Response, next: () => any) => {
  const missingFields = fields.filter((field) => !req.body[field]);
  if (missingFields.length) {
    return makeResponse(res, {
      status: StatusCodes.BAD_REQUEST,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }
  return next();
};
