import Comment from "@/components/forms/Comment";
import Thread from "@/components/forms/Thread";
import NoResults from "@/components/shared/NoResults";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const Page = async ({ params }: any) => {
  let initialValues;
  let thread;
  const { userId } = auth();

  try {
    const result = await fetchThreadById(params.id);
    thread = JSON.parse(JSON.stringify(result));
    console.log(thread.parentId);
    // if (thread.parentId) {
    //   return (
    //     <div>
    //       <h1 className="head-text text-light-1">Error</h1>
    //       <NoResults
    //         title="You are not able to edit a comment"
    //         description="You can't edit comments in our app"
    //         buttonTitle="Go back"
    //         href="/"
    //       />
    //     </div>
    //   );
    // }
    if (!userId) {
      return (
        <div>
          <h1 className="head-text text-light-1">
            403 code. Access is forbidden.
          </h1>
          <NoResults
            title="You are not logged in"
            description="You must be logged in to edit this thread. Please log in and try again. If you believe this is an error, contact support (niktestpython@gmail.com) for further assistance."
            buttonTitle="Sign In"
            href="/sign-in"
          />
        </div>
      );
    }
    initialValues = {
      id: thread._id,
      text: thread.text,
    };
    if (thread.author.clerkId !== userId) {
      return (
        <div>
          <h1 className="head-text text-light-1">
            403 code. Access is forbidden.
          </h1>
          <NoResults
            title="You are not the thread creator"
            description="You do not have permission to edit this thread. Please ensure you are logged in with the correct account. If you believe this is an error, contact support (niktestpython@gmail.com) for further assistance."
            buttonTitle="Go back"
            href="/"
          />
        </div>
      );
    }
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error</h1>
        <NoResults
          title="Error fetching thread data"
          description="There was an error fetching the thread data. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="head-text text-light-1">Edit a Thread</h1>
      <div className="mt-9">
        {!thread.parentId ? (
          <Thread
            initialValues={initialValues}
            type="edit"
            userId={thread.author._id}
          />
        ) : (
          <Comment
            threadId={thread._id}
            initialValues={{ text: thread.text }}
            type="edit"
            currentUserImg={thread.author.image}
            currentUserId={thread.author._id}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
