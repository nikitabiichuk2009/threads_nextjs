import mongoose from "mongoose";
import User from "./models/user.model";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_DB_URL) {
    return console.log("NO MongoDB URL!");
  }

  if (isConnected) {
    return console.log("MongoDB is already connected");
  }

  console.log(`Connecting to: ${process.env.MONGO_DB_URL}`);

  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "threads_nextjs",
    });
    isConnected = true;
    console.log("DB is connected!");

    // Ensure no duplicate community IDs in users' communities arrays
    const users = await User.find();
    const updateUserPromises = users.map(async (user: any) => {
      const uniqueCommunities = user.communities.filter(
        (community: any, index: any, self: any) =>
          index ===
          self.findIndex((c: any) => c.toString() === community.toString())
      );

      if (uniqueCommunities.length !== user.communities.length) {
        user.communities = uniqueCommunities;
        return user.save();
      }
    });

    await Promise.all(updateUserPromises);
    console.log("Duplicates removed from users' communities arrays!");
  } catch (err) {
    console.log(err);
    throw new Error("Database connection failed");
  }
};
