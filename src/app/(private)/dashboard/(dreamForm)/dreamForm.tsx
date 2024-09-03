"use client";

import React, { useEffect, useRef, useState } from "react";
import { undefined, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { analyse } from "./actions";
import { dreamAnalysis } from "@/app/(model)/aiResponseModel";
import DreamModalNew from "./dreamModalNew";
import { DNA } from "react-loader-spinner";

export const FormSchema = z.object({
  title: z
    .string()
    .min(10, {
      message: "Title must be atleast 10 characters ",
    })
    .max(30, { message: "Keep it a below 30 characters" }),
  content: z
    .string()
    .min(10, {
      message: "Content must be atleast 50 characters",
    })
    .max(150, { message: "We currently support only 150 words in content" }),
});

export default function DreamForm() {
  const [aiResponseModel, setAiResponseModel] = useState<dreamAnalysis | null>(
    new dreamAnalysis()
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFetchingResult, setIsFetchingResult] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const titleRef = useRef("");
  const contentRef = useRef("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      setShowLoader(true);
      const analysisObject = await analyse(formData);
      setAiResponseModel(JSON.parse(analysisObject));
      setIsModalOpen(true);
      setIsFetchingResult(false);
      setShowLoader(false);
      form.reset();
    } catch (error) {
      setIsFetchingResult(false);
      setShowLoader(false);
      console.error(`Could not fetch the response from Gemini API`);
    }
  }

  // useEffect(() => {
  //   if (!isModalOpen && !isFetchingResult) {
  //     setIsFetchingResult(false);
  //   }
  // }, [isModalOpen]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-11"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-center flex justify-center">
                  Title
                </FormLabel>
                <FormControl className="w-auto m-auto">
                  <Input
                    placeholder="Give a title to your dream"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="text-center text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full text-center flex justify-center">
                  Content
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us something more about your dream"
                    className="resize-none h-48 w-4/5 m-auto"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="text-center text-xs" />
              </FormItem>
            )}
          />
          <div className="btn-container text-center">
            <Button type="submit" className="">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      {showLoader && (
        <div className="w-full flex justify-center absolute top-1/3">
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      {isModalOpen && (
        <DreamModalNew
          aiResponseModel={aiResponseModel}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
}
