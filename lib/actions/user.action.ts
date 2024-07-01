"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

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
    await User.findOneAndDelete({ clerkId: userId });
    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}
