import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  joinDate: Date;
  threads: Schema.Types.ObjectId[];
  savedPosts: Schema.Types.ObjectId[];
  communities: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  image: { type: String },
  location: { type: String },
  portfolio: { type: String },
  joinDate: { type: Date, default: Date.now },
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  communities: [{ type: Schema.Types.ObjectId, ref: "Community" }],
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
