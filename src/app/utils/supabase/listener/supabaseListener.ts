import {
  analysisInsertListener,
  dreamInsertListener,
} from "@/app/(private)/dashboard/(dreamForm)/actions";
import { createClient } from "../server/supabase";

const supabase = createClient();
// supabase
//   .channel("dreamAnalysis")
//   .on(
//     "postgres_changes",
//     { event: "INSERT", schema: "public", table: "dream" },
//     dreamInsertListener
//   )
//   .on(
//     "postgres_changes",
//     { event: "INSERT", schema: "public", table: "analysis" },
//     analysisInsertListener
//   )
//   .subscribe();
