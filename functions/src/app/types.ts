import * as express from "express";
import { StatusCodes } from "http-status-codes";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import Model from "../services/db/model";

export type ErrorWithMessage = {
    message: string
}

export type ResponseConfig = {
    status: StatusCodes.OK | number;
    error?: unknown;
    data?: { [key: string]: any };
}


export type HandlerConfig = {
    res: express.Response;
    req: express.Request;
    model: Model;
    id?: string;
}


export interface Request extends express.Request {
    decodedToken: DecodedIdToken;
}
