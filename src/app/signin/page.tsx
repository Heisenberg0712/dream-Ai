"use client";

import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";

import React, { useEffect, useState } from "react";
import { signin } from "./actions";
import { signup } from "../signup/actions";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client/supabase";
import ToastProvider from "../(provider)/toast.provider";

export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const supabase = createClient();
    const response = await supabase.auth.getUser();
    if (response.data) {
      //setUser(response.data.user)
      router.push("/dashboard");
    } else {
      setUser(null);
    }
  };

  const signInUser_ = (formData: FormData) =>
    toast.promise(() => signInUser(formData), {
      pending: "Signing you in",
      success: "Signed in",
      error: "Could not sign in",
    });

  const signInUser = async (formData: FormData) => {
    const response = await signin(formData);
    setErrorMessage(response);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="border border-red-600 w-1/2 m-auto text-center">
      Sign in page
      <form className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="text-black"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="text-black"
        />
        <button formAction={signInUser_}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
      {errorMessage != null && <p>{errorMessage}</p>}
      <ToastProvider />
    </div>
  );
}
