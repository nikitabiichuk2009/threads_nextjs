"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const LocalSearchBar = ({
  route,
  searchFor,
  iconPosition,
  imgSrc,
  otherClasses,
}: {
  searchFor: string;
  iconPosition: string;
  imgSrc: string;
  otherClasses?: string;
  route?: string;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
      return () => clearTimeout(delayDebounceFn);
    }, 300);
  }, [search, pathName, searchParams, query, router, route]);

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`relative border border-dark-4 bg-dark-3 flex min-h-[56px] grow items-center rounded-xl px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <>
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="search"
            className="cursor-pointer"
            onClick={handleImageClick}
          />
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            placeholder={searchFor}
            ref={inputRef}
            value={search}
            className="no-focus bg-transparent text-light-1 
            min-h-[56px] border-none text-[16px] font-normal leading-[22.4px]"
          />
        </>
      )}
      {iconPosition === "right" && (
        <>
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            placeholder={searchFor}
            ref={inputRef}
            value={search}
            className="paragraph-regular no-focus placeholder 
            text-dark400_light700 ml-2 border-none
           bg-transparent shadow-none outline-none"
          />
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="search"
            className="cursor-pointer"
            onClick={handleImageClick}
          />
        </>
      )}
    </div>
  );
};

export default LocalSearchBar;
