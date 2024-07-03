import { Schema, models, model, Document } from "mongoose";

export interface IThread extends Document {
  text: string;
  author: Schema.Types.ObjectId;
  community: Schema.Types.ObjectId;
  children: Schema.Types.ObjectId[];
  parentId: string;
  createdAt: Date;
  likes: number;
}

const ThreadSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: Schema.Types.ObjectId, ref: "Community" },
  children: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  parentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

const Thread = models.Thread || model<IThread>("Thread", ThreadSchema);

export default Thread;
