import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const dbUrl = process.env.DB_URL as string;
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 4000;

export const db = mongoose
  .connect(dbUrl, {
    dbName: dbName,
  })
  .then(() => {
    console.log(`Server running on port ${port}`);
  })
  .catch((err: any) => {
    console.error(err);
  });
