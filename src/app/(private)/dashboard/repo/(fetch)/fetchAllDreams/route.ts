import { dream } from "@prisma/client";
import prisma from "../../../../../../../prisma/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { prismaResponse } from "@/app/interface/response";

export async function GET() {
  try {
    let allDreams: Array<dream> = await prisma.dream.findMany();
    return Response.json({
      data: allDreams,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json<prismaResponse>({
      data: new Array<dream>(),
      status: 500,
    });
  }
}
