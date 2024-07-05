"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/user";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePathname, useRouter } from "next/navigation";
import NoResults from "../shared/NoResults";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { Input } from "../ui/input";
import { addCommentToThread } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  currentUserId: string;
  currentUserImg: string;
}
const Comment = ({ threadId, currentUserId, currentUserImg }: Props) => {
  const [error, setError] = useState(false);
  const pathName = usePathname();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  });
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (!currentUserId || !currentUserImg) {
      toast({
        title: "You need to log in to create a comment.",
        className: "bg-blue text-white border-none",
      });
      return;
    }
    setLoading(true);

    try {
      await addCommentToThread(
        threadId,
        values.comment,
        currentUserId,
        pathName
      );
      setLoading(false);
      toast({
        title: "Successfully created a comment.",
        className: "bg-green-500 text-white border-none",
      });
      form.reset();
    } catch (err) {
      setError(true);
      setLoading(false);
      toast({
        title: "Failed to create a comment.",
        className: "bg-red-500 text-white border-none",
      });
    }
  }

  if (error) {
    return (
      <NoResults
        title="Error occurred"
        description="There was an error while creating a comment. Please try reloading the page, pressing the button or trying again later."
        buttonTitle="Go back"
        href="/"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex gap-3 flex-row w-full items-center">
              <FormLabel>
                <div className="relative size-12">
                  <Image
                    src={currentUserImg || "/assets/user.svg"}
                    alt="profile image"
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                </div>
              </FormLabel>
              <FormControl className="no-focus border border-none bg-transparent text-light-1">
                <Input {...field} placeholder="Your comment" />
              </FormControl>
              <FormMessage className="text-red-500 text-[14px]" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="comment-form_btn">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
