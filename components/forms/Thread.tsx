"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { threadValidation } from "@/lib/validations/user";
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
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.action";
import { useRouter } from "next/navigation";
import NoResults from "../shared/NoResults";
import { useToast } from "../ui/use-toast";

const Thread = ({ userId }: { userId: string }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof threadValidation>>({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  async function onSubmit(values: z.infer<typeof threadValidation>) {
    setLoading(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      await createThread({
        text: values.thread,
        author: userId,
        path: "/",
        communityId: null,
      });
      router.push("/");
      toast({
        title: "Successfully created a thread.",
        className: "bg-green-500 text-white border-none",
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to create a thread",
        className: "bg-red-500 text-white border-none",
      });
      setError(true);
      setLoading(false);
    }
  }

  if (error) {
    return (
      <NoResults
        title="Error occurred"
        description="There was an error while creating a thread. Please try reloading the page, pressing the button or trying again later."
        buttonTitle="Go back"
        href="/"
      />
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 flex-col w-full">
              <FormLabel className="font-semibold text-[20px] text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea {...field} rows={10} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="mt-5 min-h-[46px] w-full bg-primary-500 px-4 py-3 font-semibold !text-light-1 transition-colors duration-300 ease-in-out hover:bg-purple-500 sm:w-fit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default Thread;
