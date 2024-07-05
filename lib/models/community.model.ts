import { Schema, models, model, Document } from "mongoose";

export interface ICommunity extends Document {
  id: string;
  name: string;
  username?: string;
  image?: string;
  bio?: string;
  createdBy: Schema.Types.ObjectId;
  threads: Schema.Types.ObjectId[];
  members: Schema.Types.ObjectId[];
}

const CommunitySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  image: { type: String },
  bio: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Community =
  models.Community || model<ICommunity>("Community", CommunitySchema);

export default Community;
