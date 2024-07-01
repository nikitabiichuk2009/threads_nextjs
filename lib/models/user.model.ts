import { Schema, models, model, Document } from "mongoose";

// Define the IUser interface extending Document for type safety
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
  communities: Schema.Types.ObjectId[];
}

// Define the User schema with appropriate fields and types
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  image: { type: String }, // URL to the user's profile picture
  location: { type: String },
  portfolio: { type: String },
  joinDate: { type: Date, default: Date.now },
  threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }], // Reference to threads
  communities: [{ type: Schema.Types.ObjectId, ref: "Community" }], // Reference to communities
});

// Create and export the User model
const User = models.User || model<IUser>("User", UserSchema);

export default User;
