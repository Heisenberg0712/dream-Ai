import { analysis, dream } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/prisma";

//Fetch the related analysis data from the given dream data
export async function POST(request: NextRequest) {
  try {
    let latestDreamData: Array<dream> = await request.json();
    let relatedAnalysisData: Array<analysis | null> = [];
    for (var i = 0; i < latestDreamData.length; i++) {
      let analysisData: analysis | null = await prisma.analysis.findFirst({
        where: {
          dream_id: latestDreamData[i].id,
        },
      });
      relatedAnalysisData.push(analysisData);
    }
    return NextResponse.json({
      data: relatedAnalysisData,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 400,
    });
  }
}
