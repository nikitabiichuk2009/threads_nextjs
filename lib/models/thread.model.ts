import { Schema, models, model, Document } from "mongoose";

export interface IThread extends Document {
  text: string;
  author: Schema.Types.ObjectId;
  community: Schema.Types.ObjectId;
  children: Schema.Types.ObjectId[];
  parentId: string;
  createdAt: Date;
}

const ThreadSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: Schema.Types.ObjectId, ref: "Community" },
  children: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  parentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Thread = models.Thread || model<IThread>("Thread", ThreadSchema);

export default Thread;
