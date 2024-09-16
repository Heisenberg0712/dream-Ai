"use client";
import React, { useEffect, useState } from "react";
import { getAllDreams, getAllRelatedAnalysis } from "./actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardHeader, Card, CardContent } from "@/components/ui/card";
import EmotionChart from "./pieChart";
import { analysis, dream } from "@prisma/client";
import { ChartDataDictionary } from "@/app/types/chartData";

export default function MyDreams() {
  const [allDreams, setAllDreams] = useState<Array<dream>>([]);
  const [allRelatedAnalysis, setAllRelatedAnalysis] = useState<Array<analysis>>(
    []
  );
  const [loadingChart, setLoadingChart] = useState<boolean>(false);
  const [emotionFrequency, setEmotionFrequency] = useState<ChartDataDictionary>(
    {}
  );
  const fetchDream = async () => {
    const dreams = await getAllDreams();
    setAllDreams(dreams);
  };
  const fetchRelatedAnalysis = async () => {
    const relatedAnalysis = await getAllRelatedAnalysis(allDreams);
    setAllRelatedAnalysis(relatedAnalysis);
  };

  useEffect(() => {
    fetchDream();
  }, []);

  useEffect(() => {
    fetchRelatedAnalysis();
  }, [allDreams]);

  useEffect(() => {
    let chartDataDictionary: ChartDataDictionary =
      getChartDataDictionary(allRelatedAnalysis);
    if (Object.keys(chartDataDictionary).length == 0) {
      return;
    }
    setEmotionFrequency(getChartDataDictionary(allRelatedAnalysis));
    setLoadingChart(true);
  }, [allRelatedAnalysis]);

  return (
    <div className="border border-red-500 p-4 max-w-md mx-auto h-screen flex flex-col overflow-hidden">
      <header className=" flex justify-center p-2 m-1 items-center gap-1 font-bold">
        My Dreams
      </header>
      <div className="h-1/2 w-11/12 border-2 border-gray-400 p-2 mx-auto rounded-md">
        <ScrollArea className="h-full w-full mx-auto ">
          {allDreams.map((dream, index) => (
            <div key={index}>
              <Card className="m-2 border rounded-sm border-gray-400 pt-5 hover:bg-gray-400">
                <CardHeader className="inline">
                  <span className="text-xl font-semibold">{dream.title}</span>
                </CardHeader>
                <div className=" border-gray-400 w-1/2 ml-5"></div>
                <CardContent className="mt-2">{dream.content}</CardContent>
              </Card>
              {/* <div className="border-t border-gray-600 w-1/2 mx-auto"></div> */}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div>
        {loadingChart && <EmotionChart emotionFrequency={emotionFrequency} />}
        {!loadingChart && <p>Please wait, while we load your chart</p>}
      </div>
    </div>
  );
}

const getChartDataDictionary = (
  analysisArray: Array<analysis>
): ChartDataDictionary => {
  if (analysisArray.length == 0) {
    return {};
  }
  let emotionDictionary: ChartDataDictionary = {};
  for (var i = 0; i < analysisArray.length; i++) {
    const emotion = analysisArray[i].emotion;
    if (emotionDictionary[emotion]) {
      emotionDictionary[emotion]++;
    } else {
      emotionDictionary[emotion] = 1;
    }
  }
  return emotionDictionary;
};
