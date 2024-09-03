"use server";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server/supabase";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: "http://localhost:3000/dashboard"!,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/signin");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
