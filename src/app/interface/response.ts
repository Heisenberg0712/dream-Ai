import { analysis, dream } from "@prisma/client";

export interface prismaResponse {
  data: Array<dream | analysis>;
  status: number;
}
