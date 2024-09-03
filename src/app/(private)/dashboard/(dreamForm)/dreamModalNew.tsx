import { addDreamAndAnalysis } from "@/app/utils/supabase/queries/addDream";
import { Button } from "@/components/ui/button";
import React from "react";

export default function DreamModalNew(props: any) {
  const acceptAnalysis = async () => {
    await addDreamAndAnalysis(props.aiResponseModel);
    props.setIsModalOpen();
  };
  return (
    <div className="border border-red-500 absolute top-0 z-10 h-full backdrop-blur-sm">
      <section className="border border-blue-500 relative top-1/3">
        <header className="text-center font-semibold text-lg">
          Category: {props.aiResponseModel.category}
        </header>
        <section className="text-center my-2.5">
          {props.aiResponseModel.analysis}
        </section>
        <footer className="text-center">
          <Button variant="ghost" onClick={acceptAnalysis}>
            Great!
          </Button>
        </footer>
      </section>
    </div>
  );
}
