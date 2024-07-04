import NoResults from "@/components/shared/NoResults";
import { getAllUsers } from "@/lib/actions/user.action";
import { stringifyObject } from "@/lib/utils";
import React from "react";

const Search = async () => {
  let allUsers;
  try {
    const allUsersFetched = getAllUsers({});
    allUsers = stringifyObject(allUsersFetched);
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading all users"
          description="Failed to load all users. Please try reloading the page, pressing the button or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <div>
      <h1 className="head-text text-light-1">Search for a specific user</h1>
    </div>
  );
};

export default Search;
