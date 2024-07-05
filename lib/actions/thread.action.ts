"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { Types } from "mongoose";
import Community from "../models/community.model";

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
    const community = await Community.findOne({ id: communityId }, { _id: 1 });
    const thread = await Thread.create({
      text,
      author,
      community: community,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: thread._id },
    });
    if (community) {
      await Community.findByIdAndUpdate(community, {
        $push: { threads: thread._id },
      });
    }
    revalidatePath(path);
  } catch (err: any) {
    console.log(err);
    throw new Error("Error creating a thread", err);
  }
}

interface FetchAllThreadsParams {
  searchQuery?: string;
  pageNumber?: number;
  pageSize?: number;
}

export async function fetchAllThreads({
  searchQuery = "",
  pageNumber = 1,
  pageSize = 10,
}: FetchAllThreadsParams) {
  try {
    await connectToDB();
    const skip = (pageNumber - 1) * pageSize;

    const query: any = {
      $or: [{ parentId: null }, { parentId: { $exists: false } }],
    };

    if (searchQuery) {
      query.$and = [{ text: { $regex: searchQuery, $options: "i" } }];
    }

    const allThreads = await Thread.find(query)
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
      .populate({
        path: "community",
        model: Community,
      })
      .exec();

    const totalPostsCount = await Thread.countDocuments(query);
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

export async function deleteThreadFromDB(threadId: string, path: string) {
  try {
    await connectToDB();

    // Find the thread and its related threads (children)
    const threadToDelete = await Thread.findById(threadId);

    if (!threadToDelete) {
      throw new Error("Thread not found");
    }

    // Recursive function to delete all child threads
    const deleteChildren = async (threadId: Types.ObjectId) => {
      const children = await Thread.find({ parentId: threadId });
      for (const child of children) {
        await deleteChildren(child._id);
      }
      await Thread.findByIdAndDelete(threadId);
    };

    // Delete the main thread and its children
    await deleteChildren(threadToDelete._id);

    revalidatePath(path);
    revalidatePath("/");
  } catch (err: any) {
    console.log(err);
    throw new Error("Error deleting the thread", err);
  }
}

interface EditThreadParams {
  threadId: string;
  newText: string;
  path: string;
}

export async function editThreadContent({
  threadId,
  newText,
  path,
}: EditThreadParams) {
  try {
    await connectToDB();

    // Find the thread by ID and update its content
    const updatedThread = await Thread.findByIdAndUpdate(
      threadId,
      { text: newText },
      { new: true }
    );

    if (!updatedThread) {
      throw new Error("Thread not found");
    }

    revalidatePath(path);
  } catch (err: any) {
    console.log(err);
    throw new Error("Error editing the thread content", err);
  }
}
