import * as express from "express";
import { ErrorWithMessage, ResponseConfig } from "./types";

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Record<string, unknown>).message === "string"
  );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};


export const makeResponse = (res: express.Response, config: ResponseConfig)=> {
  const { data, status, error } = config;

  if (error) {
    // const message = getReasonPhrase(status);
    // if (error && error instanceof Error) message = error.message;

    const message = getErrorMessage(error);
    res.status(status).send({ error: message });
    return;
  }

  res.status(status).send({ ...data });
  return;
};
