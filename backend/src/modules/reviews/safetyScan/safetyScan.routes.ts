import { Router } from "express";
import { validate } from "../../../middlewares/validate.js";
import { safetyScanController } from "./safetyScan.controller.js";
import { safetyScanSchema } from "./safetyScan.validators.js";

export const safetyScanRoutes = Router();

safetyScanRoutes.post("/safety-scan", validate(safetyScanSchema), safetyScanController.scan);
