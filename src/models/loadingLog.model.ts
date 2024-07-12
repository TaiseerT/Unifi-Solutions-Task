import { Schema, model, Document } from "mongoose";

interface ILoadingLog extends Document {
  mover: Schema.Types.ObjectId;
  items: Schema.Types.ObjectId[];
  timestamp: Date;
}

const loadingLogSchema = new Schema<ILoadingLog>({
  mover: { type: Schema.Types.ObjectId, ref: "MagicMover", required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "MagicItem", required: true }],
  timestamp: { type: Date, default: Date.now },
});

export const LoadingLog = model<ILoadingLog>("LoadingLog", loadingLogSchema);
