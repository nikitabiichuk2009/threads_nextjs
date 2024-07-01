"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

export async function createUser(userData: object, path: string) {
  try {
    await connectToDB();
    await User.create(userData);
    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function updateUser(
  userId: string,
  updateData: object,
  path: string
) {
  try {
    await connectToDB();
    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error(`User with clerkId ${userId} not found`);
    }
    await User.findOneAndUpdate({ clerkId: userId }, updateData, {
      upsert: true,
    });
    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(userId: string, path: string) {
  try {
    await connectToDB();
    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error(`User with clerkId ${userId} not found`);
    }

    // Delete all threads created by the user
    await Thread.deleteMany({ author: user._id });

    // Delete the user
    await User.findOneAndDelete({ clerkId: userId });

    // Revalidate the path
    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDB();
    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user.toObject() };
  } catch (err) {
    console.log(err);
    throw new Error("Error fetching user data");
  }
}

export async function savePost(
  userClerkId: string,
  postId: string,
  path: string
) {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.savedPosts && user.savedPosts.includes(postId)) {
      await User.updateOne(
        { clerkId: userClerkId },
        { $pull: { savedPosts: postId } }
      );
    } else {
      await User.updateOne(
        { clerkId: userClerkId },
        { $push: { savedPosts: postId } }
      );
    }

    const updatedUser = await User.findOne({ clerkId: userClerkId });
    revalidatePath(path);
    revalidatePath("/");
    return updatedUser.savedPosts;
  } catch (err: any) {
    console.log(err);
    throw new Error("Error saving the post", err);
  }
}
