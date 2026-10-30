import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { syncClerkUserToDb } from "@/lib/sync-user";

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinHandler = async (props: Props) => {
  const { projectId } = await props.params;
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  await syncClerkUserToDb();
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project) return redirect("/dashboard");
  try {
    await db.userToProject.create({
      data: {
        userId,
        projectId,
      },
    });
  } catch (error) {
    console.log("User already in the project.");
  }
  return redirect("/dashboard");
};

export default JoinHandler;
