import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../../../prisma/prisma";
import { type dreamAnalysis } from "../../../../(model)/aiResponseModel";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const dream = await prisma.dream.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });
    const analysis = await prisma.analysis.create({
      data: {
        emotion: data.emotion,
        analysis: data.analysis,
        dream_id: dream.id,
      },
    });
    return NextResponse.json({
      message: "Dream data received successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Dream data could not be recieved.",
      status: 500,
    });
  }
}
