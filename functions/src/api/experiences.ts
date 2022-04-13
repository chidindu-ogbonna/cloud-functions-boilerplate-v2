import * as express from "express";
import * as handler from "../app/handler";
import { useAuthorization } from "../app/middlewares";
import Model from "../services/db/model";


const app = express();
const getExperiencesModel = (id: string) => new Model(`business/${id}/experiences`);


app.get("/", (req: any, res) => {
  const model = getExperiencesModel(req.decodedToken.uid);
  return handler.list({ model, req, res });
});

app.post("/", useAuthorization, (req: any, res) => {
  const model = getExperiencesModel(req.decodedToken.uid);
  return handler.list({ model, req, res });
});

app.get("/:id", (req: any, res) => {
  const model = getExperiencesModel(req.decodedToken.uid);
  return handler.get({ model, req, res, id: req.params.id });
});

app.put("/:id", useAuthorization, (req: any, res: express.Response) => {
  const model = getExperiencesModel(req.decodedToken.uid);
  return handler.update({ model, req, res, id: req.params.id });
});

app.delete("/:id", useAuthorization, (req: any, res: express.Response) => {
  const model = getExperiencesModel(req.decodedToken.uid);
  return handler.destroy({ model, req, res, id: req.params.id });
});

export default app;
