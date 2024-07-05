import UserCard from "@/components/cards/UserCard";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResults from "@/components/shared/NoResults";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps, stringifyObject } from "@/lib/utils";
import React from "react";

const Search = async ({ searchParams }: SearchParamsProps) => {
  const searchQuery = searchParams ? searchParams.q : "";

  let allUsers;
  try {
    const allUsersFetched = await getAllUsers({ searchQuery });
    allUsers = stringifyObject(allUsersFetched.users);
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
      <h1 className="head-text text-light-1 mb-10">
        Search for a specific user
      </h1>
      <LocalSearchBar
        searchFor="Search for users"
        iconPosition="left"
        route="/"
        imgSrc="/assets/search.svg"
        otherClasses="flex-1"
      />
      <div className="mt-10 flex flex-col gap-9">
        {allUsers.length === 0 ? (
          <NoResults
            title="No users found"
            description={
              searchQuery
                ? `No users found matching your search "${searchQuery}". Try adjusting your search terms or explore other users.`
                : "No users have been found. Be the first to sign up and start exploring the community."
            }
            buttonTitle="Be the first"
            href="/sign-in"
          />
        ) : (
          allUsers.map((user: any) => {
            return (
              <UserCard
                key={user._id}
                clerkId={user.clerkId}
                name={user.name}
                username={user.username}
                img={user.image}
                personType="User"
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Search;
