"use client";
import React, { useEffect, useState } from "react";
import prisma from "../../../../../prisma/prisma";
import { dream, analysis } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCaretDown } from "@tabler/icons-react";
import { createClient } from "@/app/utils/supabase/client/supabase";

export default function LatestAnalysis() {
  const [latestAnalysisData, setLatestAnalysisData] = useState<
    Array<analysis | null>
  >([]);
  const [latestDreams, setLatestDreams] = useState<Array<dream>>([]);
  const supabase = createClient();

  const listenToAnalysisInsert = async (payload: any) => {
    fetchLatestDreams();
  };

  const fetchLatestDreams = async () => {
    const latestDreamResponse: Response = await fetch(
      "/dashboard/repo/fetchLatestDream"
    );
    const dreamData = await latestDreamResponse.json();
    setLatestDreams(dreamData.data);
    console.log(dreamData);
  };

  const fetchRelatedLatestAnalysis = async () => {
    const latestAnalysisData: Response = await fetch(
      "/dashboard/repo/fetchLatestAnalysis",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(latestDreams),
      }
    );
    const analysisData = await latestAnalysisData.json();
    setLatestAnalysisData(analysisData.data);
    console.log(analysisData);
  };

  const fetchRealtimeData = () => {
    try {
      const dreamAnalysisChannel = supabase
        .channel("dreamAnalysis")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "dream" },
          (payload) => {
            console.log(payload.new);
          }
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "analysis" },
          (payload) => {
            listenToAnalysisInsert(payload);
          }
        )
        .subscribe();
      return () => supabase.removeChannel(dreamAnalysisChannel);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLatestDreams();
    fetchRealtimeData();
  }, []);
  useEffect(() => {
    if (latestDreams.length != 0) {
      fetchRelatedLatestAnalysis();
    }
  }, [latestDreams]);

  return (
    <Carousel
      orientation="horizontal"
      className=" w-full max-w-md mx-auto mt-4 "
    >
      <CarouselContent>
        {latestAnalysisData.map((analysisData, index) => (
          <CarouselItem key={index} className=" flex flex-col justify-center">
            <Card className="border border-gray-500 h-[300px] ">
              <CardHeader>
                <CardTitle>Title: {latestDreams.at(index)?.title}</CardTitle>
              </CardHeader>
              <CardContent className=" text-justify text-sm">
                <div className="overflow-y-auto h-full">
                  {analysisData != null && analysisData.analysis}
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="" />
      <CarouselPrevious />
      <div className="flex justify-center animate-bounce mt-2 text-slate-500 ">
        <IconCaretDown stroke={2} className="cursor-pointer" />
      </div>
    </Carousel>
  );
}

const getRelatedDream = async (latestData: any) => {
  let relatedDreams: Array<dream | null> = [];
  for (let i = 0; i < latestData.length; i++) {
    const dream = await prisma.dream.findFirst({
      where: {
        id: latestData[i].dream_id,
      },
    });
    relatedDreams.push(dream);
  }
  return relatedDreams;
};
