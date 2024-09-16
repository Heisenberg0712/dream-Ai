import { analysis } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/prisma";
import { prismaResponse } from "@/app/interface/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dreamId = searchParams.get("dream");
    if (dreamId == null || dreamId == undefined) {
      return;
    }
    let relatedAnalysis: analysis | null = await prisma.analysis.findFirst({
      where: {
        dream_id: +dreamId!,
      },
    });
    let analysisList = new Array<analysis>();
    analysisList.push(relatedAnalysis!);
    return NextResponse.json<prismaResponse>({
      data: analysisList,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json<prismaResponse>({
      data: new Array<analysis>(),
      status: 500,
    });
  }
}
