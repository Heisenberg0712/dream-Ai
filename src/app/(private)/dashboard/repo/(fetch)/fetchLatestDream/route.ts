import { NextResponse, type NextRequest } from "next/server";
import prisma from "../../../../../../../prisma/prisma";
import { dream } from "@prisma/client";

///Fetches latest 3 dreams
export async function GET(request: NextRequest) {
  try {
    let latestDream: Array<dream> = await prisma.dream.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: 3,
    });
    return NextResponse.json({
      data: latestDream,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
    });
  }
}
