import express, { Express, Request, Response } from "express";
import { db } from "./dbConnection";
import magicItemRoutes from "./routes/magicItem.route";
import magicMoverRoutes from "./routes/magicMover.route";
const app: Express = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/magicMover", magicMoverRoutes);
app.use("/api/magicItem", magicItemRoutes);
db.then(() => {
  app.listen(port, () =>
    console.log(`server running at http://localhost:${port}`)
  );
});
