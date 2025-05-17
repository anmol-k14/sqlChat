import { Router } from "express";
import * as aiController from "../controller/aiController.js";

const router = Router();

router.post("/get-result",aiController.getResult); 

export default router;