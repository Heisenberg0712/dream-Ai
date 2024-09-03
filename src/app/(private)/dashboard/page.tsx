import { createClient } from "@/app/utils/supabase/server/supabase";
import { IconHome2 } from "@tabler/icons-react";
import React from "react";
import DreamForm from "./(dreamForm)/dreamForm";
import LatestAnalysis from "./(analysis)/latestAnalysis";

export default async function Dashboard() {
  return (
    <div className="border border-red-500 p-4 max-w-md mx-auto h-screen flex flex-col overflow-hidden">
      <header className=" flex justify-center p-2 m-1 items-center gap-1">
        Dashboard <IconHome2 stroke={1.5} />
      </header>
      <div className="flex-grow">
        <DreamForm />
        <LatestAnalysis />
      </div>
    </div>
  );
}
