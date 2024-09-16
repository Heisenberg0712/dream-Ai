"use server";

import { analysis, dream } from "@prisma/client";
import prisma from "../../../../../prisma/prisma";

export async function getAllRelatedAnalysis(allDreams: Array<dream>) {
  const allRelatedAnalysis: Array<analysis> = [];
  for (var i = 0; i < allDreams.length; i++) {
    const relatedAnalysis = await prisma.analysis.findFirst({
      where: {
        dream_id: allDreams[i].id,
      },
    });
    allRelatedAnalysis.push(relatedAnalysis!);
  }
  return allRelatedAnalysis;
}

export async function getAllDreams() {
  const allDreams: Array<dream> = await prisma.dream.findMany();
  return allDreams;
}
