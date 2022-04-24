import * as express from "express";
import * as handler from "../app/handler";
import { useAuthorization, useHasRequiredFields } from "../app/middlewares";
import Model from "../services/db/model";


const app = express();
const usersModel = new Model("business");


app.get("/", (req, res) => {
  return handler.list({ model: usersModel, req, res });
});

app.get("/:id", (req, res) => {
  return handler.get({ model: usersModel, req, res, id: req.params.id });
});

app.post("/",
  [
    useAuthorization,
    useHasRequiredFields(["id", "businessName", "businessCategory", "email"])],
  // Have a middleware to handle validation
  // useValidator({ "email": validators.isEmail }),
  (req: any, res: express.Response) => {
    return handler.create({ model: usersModel, req, res });
  });

app.put("/:id", useAuthorization, (req, res) => {
  return handler.update({ model: usersModel, req, res, id: req.params.id });
});

app.delete("/:id", useAuthorization, (req, res) => {
  return handler.destroy({ model: usersModel, req, res, id: req.params.id });
});

export default app;
