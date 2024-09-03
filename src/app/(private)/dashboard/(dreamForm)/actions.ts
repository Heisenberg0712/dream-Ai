"use server";

import { analyseDream } from "@/lib/gemini";
import { z } from "zod";
import { FormSchema } from "./dreamForm";
import { dreamAnalysis } from "@/app/(model)/aiResponseModel";

export async function analyse(formData: z.infer<typeof FormSchema>) {
  try {
    const result = await analyseDream(formData.content);
    console.log(JSON.parse(result.response.text()));
    const data = JSON.parse(result.response.text());
    const response = new dreamAnalysis(
      data.Status,
      data.Emotion,
      data.Category,
      data.Analysis,
      formData.title,
      formData.content
    );
    return JSON.stringify(response);
  } catch (error) {
    console.log("Could not fetch the response from gemini api");
    throw error;
  }
}

export const dreamInsertListener = (payload: any) => {
  console.log("Row inserted in Dream table");
};
export const analysisInsertListener = (payload: any) => {
  console.log("Row inserted in Analysis table");
};
