import { dreamAnalysis } from "@/app/(model)/aiResponseModel";

export const addDreamAndAnalysis = async (aiResponseModel: dreamAnalysis) => {
  const res = await fetch("dashboard/repo/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aiResponseModel),
  });
  const content = await res.json();
  console.log(content);
};
