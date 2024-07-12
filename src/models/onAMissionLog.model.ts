import { Schema, model, Document } from "mongoose";

interface IOnAMissionLog extends Document {
  mover: Schema.Types.ObjectId;
  activity: String;
  timestamp: Date;
}

const onAMissionSchema = new Schema<IOnAMissionLog>({
  mover: { type: Schema.Types.ObjectId, ref: "MagicMover", required: true },
  activity: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const OnAMissionLog = model<IOnAMissionLog>(
  "OnAMissionLog",
  onAMissionSchema
);
