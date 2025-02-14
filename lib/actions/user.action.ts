"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { Schema, Types } from "mongoose";
import { SortOrder } from "mongoose";
import { FilterQuery } from "mongoose";
import Community from "../models/community.model";

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
  path: string,
  isSaved: boolean
) {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      throw new Error("User not found");
    }
    // Ensure savedPosts is an array
    if (!Array.isArray(user.savedPosts)) {
      user.savedPosts = [];
    }

    const postObjectId = new Types.ObjectId(postId);

    if (!isSaved) {
      console.log(true);
      // Add postObjectId to savedPosts
      const userUpdated = await User.updateOne(
        { clerkId: userClerkId },
        { $addToSet: { savedPosts: postObjectId } } // Using $addToSet to prevent duplicates
      );
      console.log(userUpdated);
    } else {
      // Remove postObjectId from savedPosts
      await User.updateOne(
        { clerkId: userClerkId },
        { $pull: { savedPosts: postObjectId } }
      );
    }

    revalidatePath(path);
    revalidatePath("/");
    revalidatePath("/activity");
  } catch (err: any) {
    console.log(err);
    throw new Error("Error saving the post");
  }
}

interface GetSavedPostsByUserParams {
  userClerkId: string;
  searchQuery?: string;
}

interface GetSavedPostsByUserParams {
  userClerkId: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export async function getSavedPostsByUser({
  userClerkId,
  searchQuery = "",
  page = 1,
  pageSize = 10,
}: GetSavedPostsByUserParams) {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userClerkId }).populate(
      "savedPosts"
    );

    if (!user) {
      throw new Error("User not found");
    }

    const skip = (page - 1) * pageSize;

    const query: any = {
      _id: { $in: user.savedPosts },
    };

    if (searchQuery) {
      query.$and = [{ text: { $regex: searchQuery, $options: "i" } }];
    }

    const savedPosts = await Thread.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({ path: "community", model: Community })
      .populate({ path: "children", populate: { path: "author", model: User } })
      .exec();

    const totalPostsCount = await Thread.countDocuments(query);
    const hasNextPage = totalPostsCount > skip + savedPosts.length;

    return { savedPosts, hasNextPage };
  } catch (err: any) {
    console.error("Error fetching saved posts:", err);
    throw new Error("Error fetching saved posts");
  }
}

export async function likePost(
  userClerkId: string,
  postId: string,
  path: string,
  isLiked: boolean
) {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      throw new Error("User not found");
    }
    if (!Array.isArray(user.likedPosts)) {
      user.likedPosts = [];
    }

    const postObjectId = new Types.ObjectId(postId);

    if (!isLiked) {
      const userUpdated = await User.updateOne(
        { clerkId: userClerkId },
        { $addToSet: { likedPosts: postObjectId } }
      );
      console.log(userUpdated);
    } else {
      await User.updateOne(
        { clerkId: userClerkId },
        { $pull: { likedPosts: postObjectId } }
      );
    }

    await Thread.updateOne(
      { _id: postObjectId },
      { $inc: { likes: isLiked ? -1 : 1 } }
    );

    revalidatePath(path);
    revalidatePath("/");
    revalidatePath("/activity");
  } catch (err: any) {
    console.log(err);
    throw new Error("Error liking the post");
  }
}

interface GetPostsByUserParams {
  userClerkId: string;
  page?: number;
  pageSize?: number;
}

export async function getPostsByUser({
  userClerkId,
  page = 1,
  pageSize = 10,
}: GetPostsByUserParams) {
  try {
    await connectToDB();

    const user = await User.findOne({ clerkId: userClerkId });

    if (!user) {
      throw new Error("User not found");
    }

    const skip = (page - 1) * pageSize;

    const userPosts = await Thread.find({
      author: user._id,
      $or: [{ parentId: null }, { parentId: { $exists: false } }],
    })
      .sort({ createdAt: -1 }) // Sort by newest
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({ path: "community", model: Community })
      .populate({ path: "children", populate: { path: "author", model: User } })
      .exec();

    const totalPostsCount = await Thread.countDocuments({
      author: user._id,
      $or: [{ parentId: null }, { parentId: { $exists: false } }],
    });

    const hasNextPage = totalPostsCount > skip + userPosts.length;

    return { userPosts, hasNextPage, total: totalPostsCount };
  } catch (err: any) {
    console.error("Error fetching user posts:", err);
    throw new Error("Error fetching user posts");
  }
}

interface GetAllUsersParams {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDB();
    const { searchQuery, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const sortOption: { [key: string]: SortOrder } = { joinDate: -1 }; // Sort by newest

    const users = await User.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalUsersCount = await User.countDocuments(query);
    const hasNextPage = totalUsersCount > skip + users.length;

    return { users, isNext: hasNextPage };
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Error fetching users");
  }
}

export async function getActivity(userId: string) {
  try {
    await connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all children thread IDs
    const childThreadsIds = userThreads.reduce(
      (acc: Schema.Types.ObjectId[], userThread) => {
        return acc.concat(userThread.children);
      },
      []
    );

    // Find all replies to the user's threads
    const replies = await Thread.find({
      _id: { $in: childThreadsIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
    }).sort({ createdAt: -1 });

    // Calculate total likes on the user's threads
    const totalLikes = userThreads.reduce((acc: number, userThread) => {
      return acc + userThread.likes;
    }, 0);

    return { replies, totalLikes };
  } catch (err: any) {
    console.log(err);
    throw new Error("Failed to load activity", err);
  }
}
