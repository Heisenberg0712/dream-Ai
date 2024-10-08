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
  type CarouselApi,
} from "@/components/ui/carousel";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/app/utils/supabase/client/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LatestAnalysis() {
  const [latestAnalysisData, setLatestAnalysisData] = useState<
    Array<analysis | null>
  >([]);
  const [latestDreams, setLatestDreams] = useState<Array<dream>>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const router = useRouter();
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

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentCardIndex(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrentCardIndex(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel
        orientation="horizontal"
        className=" w-full max-w-md mx-auto mt-4 "
        setApi={setApi}
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
      </Carousel>
      {!api?.canScrollNext() && (
        <div className="flex justify-center animate-bounce mt-2 text-slate-500 hover:cursor-pointer">
          <Link href="/dashboard/mydreams">more dreams...</Link>
        </div>
      )}
      {api?.canScrollNext() && (
        <div className="flex justify-center animate-bounce mt-2 text-slate-500 ">
          {currentCardIndex} of 3
        </div>
      )}
    </div>
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
