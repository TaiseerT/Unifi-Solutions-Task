import { Router } from "express";
import {
  addMagicMover,
  endMission,
  getTopMovers,
  loadMagicMover,
  startMission,
} from "../controllers/magicMover.controller";

const magicMoverRoutes = Router();

magicMoverRoutes.post("/add-magic-mover", addMagicMover);
magicMoverRoutes.patch("/load-magic-mover", loadMagicMover);
magicMoverRoutes.patch("/start-mission", startMission);
magicMoverRoutes.patch("/end-mission", endMission);
magicMoverRoutes.get("/get-top-movers", getTopMovers);

export default magicMoverRoutes;
