import { getSession } from "@/actions/getSession";
import { UppyUpload } from "@/components/UppyUpload/UppyUpload";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();
  const session = await getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div>
      <UppyUpload session={session} />
    </div>
  );
}
