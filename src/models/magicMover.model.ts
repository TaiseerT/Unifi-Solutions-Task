import { Schema, model, Document } from "mongoose";

interface IMagicMover extends Document {
  weight_limit: number;
  energy: number;
  quest_state: string;
  items: Schema.Types.ObjectId[];
}

const magicMoverSchema = new Schema<IMagicMover>({
  weight_limit: { type: Number, required: true },
  energy: { type: Number, required: true },
  quest_state: {
    type: String,
    default: "resting",
    enum: ["resting", "loading", "on a mission", "done"],
  },
  items: [{ type: Schema.Types.ObjectId, ref: "MagicItem" }],
});

export const MagicMover = model<IMagicMover>("MagicMover", magicMoverSchema);
