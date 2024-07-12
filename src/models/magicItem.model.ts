import { Schema, model, Document } from "mongoose";

interface IMagicItem extends Document {
  name: string;
  weight: number;
}

const magicItemSchema = new Schema<IMagicItem>({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
});

export const MagicItem = model<IMagicItem>("MagicItem", magicItemSchema);
