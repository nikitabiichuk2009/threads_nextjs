import Thread from "@/components/forms/Thread";
import NoResults from "@/components/shared/NoResults";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const CreateThread = async () => {
  const { userId } = auth();
  let mongoUser;
  if (!userId) {
    redirect("/sign-in");
  }
  try {
    mongoUser = await getUserById(userId);
  } catch (err: any) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading user"
          description="Failed to load user information. Please try reloading the page, pressing the button or trying again later.."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  // console.log(mongoUser);
  return (
    <>
      <h1 className="head-text text-light-1">Create Thread</h1>
      <Thread
        userId={mongoUser._id ? mongoUser._id : ""}
        type="create"
        initialValues={{ text: "", id: "" }}
      />
    </>
  );
};

export default CreateThread;
