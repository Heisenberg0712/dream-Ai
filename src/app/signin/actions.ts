"use server";

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server/supabase";
import { revalidatePath } from "next/cache";

export async function signin(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    if (error.message === "Invalid login credentials") {
      return "Incorrect credentials";
    }
    redirect("/signin");
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
