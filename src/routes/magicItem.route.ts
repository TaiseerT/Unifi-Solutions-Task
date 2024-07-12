import { Router } from "express";
import { addMagicItem } from "../controllers/magicItem.controller";

const magicItemRoutes = Router();

magicItemRoutes.post("/add-magic-item", addMagicItem);

export default magicItemRoutes;
