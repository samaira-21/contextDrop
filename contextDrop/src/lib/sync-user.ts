import { auth, clerkClient } from "@clerk/nextjs/server";

import { db } from "@/server/db";

export async function syncClerkUserToDb() {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const emailAddress = user.emailAddresses[0]?.emailAddress;
  if (!emailAddress) return null;

  const profile = {
    emailAddress,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const existingById = await db.user.findUnique({
    where: { id: userId },
  });
  if (existingById) {
    return db.user.update({
      where: { id: userId },
      data: profile,
    });
  }

  const existingByEmail = await db.user.findUnique({
    where: { emailAddress },
  });
  if (existingByEmail && existingByEmail.id !== userId) {
    await db.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          ...profile,
          emailAddress: `pending-sync-${userId}@invalid.local`,
          credits: existingByEmail.credits,
        },
      });
      await tx.userToProject.updateMany({
        where: { userId: existingByEmail.id },
        data: { userId },
      });
      await tx.question.updateMany({
        where: { userId: existingByEmail.id },
        data: { userId },
      });
      await tx.razorpayTransaction.updateMany({
        where: { userId: existingByEmail.id },
        data: { userId },
      });
      await tx.user.delete({ where: { id: existingByEmail.id } });
      await tx.user.update({
        where: { id: userId },
        data: profile,
      });
    });
    return db.user.findUnique({ where: { id: userId } });
  }

  return db.user.create({
    data: {
      id: userId,
      ...profile,
    },
  });
}
