import * as express from "express";
import { WhereFilterOp } from "firebase-admin/firestore";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Model from "../services/db/model";
import { makeResponse } from "./helpers";
import { DBResult } from "../services/db/types";
import { HandlerConfig } from "../app/types";


const getItemOr404 = async (config: { model: Model, id: string, res: express.Response }) => {
  const { model, id, res } = config;
  const item = await model.get(id);
  if (!item) {
    return makeResponse(res, { status: StatusCodes.NOT_FOUND, error: ReasonPhrases.NOT_FOUND });
  }
  return item;
};

export const get = async (config: HandlerConfig) => {
  try {
    const data: DBResult = await getItemOr404({
      model: config.model,
      id: config.id!,
      res: config.res,
    });
    return makeResponse(config.res, { status: StatusCodes.OK, data });
  } catch (error) {
    return makeResponse(config.res, { status: StatusCodes.INTERNAL_SERVER_ERROR, error });
  }
};


export const list = async (config: HandlerConfig) => {
  try {
    const { model, req } = config;
    const { limit, order, startAfter, ...rest } = req.params;

    const filters = Object.keys(rest).map((key) => ({
      field: key,
      operation: "==" as WhereFilterOp,
      value: rest[key],
    }));
    const results = await model.list({
      filters,
      orders: [{ field: order ? order : "createdAt", direction: order ? "asc" : "desc" }],
      limit: parseInt(limit || process.env.DEFAULT_LIMIT!),
      startAfter,
    });
    const last = results[results.length - 1];
    const lastKey = order ? last[order] : last.createdAt;

    return makeResponse(config.res, {
      status: StatusCodes.OK,
      data: {
        count: results.length,
        lastKey,
        results,
      },
    });
  } catch (error) {
    return makeResponse(config.res, { status: StatusCodes.INTERNAL_SERVER_ERROR, error });
  }
};

export const create = async (config: HandlerConfig) => {
  try {
    const { model, req } = config;
    const data = await model.create({ id: config.id, ...req.body });
    return makeResponse(config.res, { status: StatusCodes.OK, data });
  } catch (error) {
    return makeResponse(config.res, { status: StatusCodes.INTERNAL_SERVER_ERROR, error });
  }
};

export const update = async (config: HandlerConfig) => {
  try {
    const { model, req } = config;
    const data = await model.update({ id: config.id!, ...req.body });
    return makeResponse(config.res, { status: StatusCodes.OK, data });
  } catch (error) {
    return makeResponse(config.res, { status: StatusCodes.INTERNAL_SERVER_ERROR, error });
  }
};

export const destroy = async (config: HandlerConfig) => {
  try {
    const { model } = config;
    const data = await model.delete(config.id!);
    return makeResponse(config.res, { status: StatusCodes.OK, data });
  } catch (error) {
    return makeResponse(config.res, { status: StatusCodes.INTERNAL_SERVER_ERROR, error });
  }
};

exports.handler = {
  get,
  list,
  create,
  update,
  destroy,
};
