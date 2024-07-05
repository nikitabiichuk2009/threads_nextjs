import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResults from "@/components/shared/NoResults";
import Pagination from "@/components/shared/Pagination";
import { fetchCommunities } from "@/lib/actions/community.action";
import { SearchParamsProps, stringifyObject } from "@/lib/utils";
import React from "react";

const Search = async ({ searchParams }: SearchParamsProps) => {
  const searchQuery = searchParams ? searchParams.q : "";
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  let allCommunities;
  let isNext;
  try {
    const communities = await fetchCommunities({
      searchString: searchQuery,
      pageNumber: page,
    });
    allCommunities = stringifyObject(communities.communities);
    isNext = stringifyObject(communities.isNext);
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading all users"
          description="Failed to load all communities. Please try reloading the page, pressing the button or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <div>
      <h1 className="head-text text-light-1 mb-10">
        Search for a specific community
      </h1>
      <LocalSearchBar
        searchFor="Search for communities"
        iconPosition="left"
        route="/"
        imgSrc="/assets/search.svg"
        otherClasses="flex-1"
      />
      <div className="mt-10 flex flex-wrap gap-9">
        {allCommunities.length === 0 ? (
          <NoResults
            title="No communities found"
            description={
              searchQuery
                ? `No communities found matching your search "${searchQuery}". Try adjusting your search terms or explore other users.`
                : "No communities have been found. Be the first to create new community."
            }
            buttonTitle="Go back"
            href="/"
          />
        ) : (
          allCommunities.map((community: any) => {
            return (
              <CommunityCard
                key={community._id}
                id={community.id}
                name={community.name}
                username={community.username}
                members={community.members}
                imgUrl={community.image}
              />
            );
          })
        )}
      </div>
      <div className="mt-10">
        <Pagination isNext={isNext} pageNumber={page} />
      </div>
    </div>
  );
};

export default Search;
