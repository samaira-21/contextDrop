import { notFound, redirect } from "next/navigation";

import { syncClerkUserToDb } from "@/lib/sync-user";
import { auth } from "@clerk/nextjs/server";

const SyncUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await syncClerkUserToDb();
  if (!user) {
    return notFound();
  }

  return redirect("/dashboard");
};

export default SyncUser;
