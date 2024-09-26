"use server";
import { createClient } from "@/utils/supabase/server";

export const getSession = async () => {
  const supabase = createClient();
  const session = (await supabase.auth.getSession()).data.session;

  if (!session) {
    throw new Error("No session found");
  }
  return session;
};
