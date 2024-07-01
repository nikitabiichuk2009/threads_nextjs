import React from "react";
import { fetchAllThreads } from "@/lib/actions/thread.action";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";

const Home = async () => {
  const { userId } = auth();
  let allThreads;
  let isNextPage;

  try {
    const result = await fetchAllThreads();
    allThreads = result.allThreads;
    isNextPage = result.isNextPage;
  } catch (err: any) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text">Error occurred</h1>
        <NoResults
          title="Error loading posts"
          description="Failed to load posts. Please try reloading the page, pressing the button or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  const stringifyObject = (obj: any) => JSON.parse(JSON.stringify(obj));

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
              console.log(thread.author.savedPosts);
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
                  isSaved={
                    thread.author.savedPosts
                      ? thread.author.savedPosts.includes(thread._id)
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
