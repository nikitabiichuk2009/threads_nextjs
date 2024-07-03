"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { Types } from "mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    await connectToDB();
    const thread = await Thread.create({
      text,
      author,
      community: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: thread._id },
    });
    revalidatePath(path);
  } catch (err: any) {
    console.log(err);
    throw new Error("Error creating a thread", err);
  }
}

export async function fetchAllThreads(pageNumber = 1, pageSize = 20) {
  try {
    await connectToDB();
    const skip = (pageNumber - 1) * pageSize;

    const allThreads = await Thread.find({
      $or: [{ parentId: null }, { parentId: { $exists: false } }],
    })
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
        },
      })
      .exec();
    const totalPostsCount = await Thread.countDocuments({
      $or: [{ parentId: null }, { parentId: { $exists: false } }],
    });
    const isNextPage = totalPostsCount > skip + allThreads.length;
    return { allThreads, isNextPage };
  } catch (err: any) {
    console.log(err);
    throw new Error("Error loading all threads", err);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    await connectToDB();

    if (!Types.ObjectId.isValid(threadId)) {
      throw new Error("Invalid thread ID");
    }

    const thread = await Thread.findById(threadId)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: [
          { path: "author", model: User },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
            },
          },
        ],
      })
      .exec();

    if (!thread) {
      throw new Error("Thread not found");
    }

    return thread;
  } catch (err: any) {
    console.log(err);
    throw new Error("Error loading thread by ID", err);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    await connectToDB();
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found!");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();
    originalThread.children.push(savedCommentThread._id);
    originalThread.save();
    revalidatePath("/");
    revalidatePath(path);
  } catch (err: any) {
    console.log(err);
    throw new Error("Error commenting", err);
  }
}
