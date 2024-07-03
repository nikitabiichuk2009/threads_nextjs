import React from "react";
import { fetchAllThreads } from "@/lib/actions/thread.action";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";
import { getUserById } from "@/lib/actions/user.action";

const Home = async () => {
  const stringifyObject = (obj: any) => JSON.parse(JSON.stringify(obj));
  const { userId } = auth();
  let allThreads;
  let isNextPage;
  let currentUser;
  try {
    const result = await fetchAllThreads();
    if (!userId) {
      currentUser = null;
    } else {
      const userResult = await getUserById(userId);
      currentUser = stringifyObject(userResult);
    }
    allThreads = result.allThreads;
    isNextPage = result.isNextPage;
  } catch (err: any) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text">Error occurred</h1>
        <NoResults
          title="Error loading posts or current logged user"
          description="Failed to load posts or current logged user. Please try reloading the page, pressing the button or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <>
      <h1 className="head-text text-white text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {allThreads.length === 0 ? (
          <NoResults
            title="No posts found"
            description="There are no posts available."
            buttonTitle="Create a post"
            href="/create-thread"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {allThreads.map((thread) => {
              const threadData = stringifyObject(thread);
              return (
                <ThreadCard
                  key={threadData._id}
                  id={threadData._id}
                  currentUserClerkId={userId ? userId : ""}
                  content={threadData.text}
                  author={threadData.author}
                  community={threadData.community}
                  createdAt={threadData.createdAt}
                  comments={threadData?.children}
                  isComment={false}
                  likes={threadData.likes}
                  isSaved={
                    currentUser?.savedPosts
                      ? currentUser.savedPosts.includes(threadData._id)
                      : false
                  }
                  isLiked={
                    currentUser?.likedPosts
                      ? currentUser.likedPosts.includes(threadData._id)
                      : false
                  }
                />
              );
            })}
          </div>
        )}
        {isNextPage && (
          <button
            onClick={() => {
              /* Logic to load next page */
            }}
          >
            Load More
          </button>
        )}
      </section>
    </>
  );
};

export default Home;
