import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prisma from "../../../../../../prisma/prisma";
import { Car } from "lucide-react";

export default async function AnalysisPage({
  params,
}: {
  params: { dreamId: string };
}) {
  const dream = await prisma.dream.findFirst({
    where: {
      id: +params.dreamId,
    },
  });
  const relatedAnalysis = await prisma.analysis.findFirst({
    where: {
      dream_id: +params.dreamId,
    },
  });

  return (
    <div>
      <header className="text-center m-2">Analysis</header>
      <Card>
        <CardHeader>
          <CardTitle>Dream : {dream?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-justify">{dream?.content}</p>
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="text-3xl font-bold">Emotion: </span>
                  {relatedAnalysis?.emotion}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-justify">
                  <span className="font-bold text-2xl">Analysis:</span>{" "}
                  {relatedAnalysis?.analysis}
                </p>
              </CardContent>
              <CardFooter>
                <p>
                  <span className="text-xl font-bold">Dreamed on:</span>{" "}
                  {relatedAnalysis?.created_at.getDate()}-
                  {relatedAnalysis?.created_at.getMonth()}-
                  {relatedAnalysis?.created_at.getFullYear()}
                </p>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
