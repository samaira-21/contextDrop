"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/server/db";
import { razorpayCredentials } from "@/lib/razorpay";
import { INR_PAISE_PER_CREDIT } from "@/lib/pricing";
import { syncClerkUserToDb } from "@/lib/sync-user";

export async function createRazorpayOrder(credits: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated.");
  await syncClerkUserToDb();
  if (!Number.isInteger(credits) || credits < 10 || credits > 1000 || credits % 10 !== 0) {
    throw new Error("Choose between 10 and 1000 credits in increments of 10.");
  }

  const { keyId, keySecret } = razorpayCredentials();
  const amount = credits * INR_PAISE_PER_CREDIT;
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: `credits-${userId}-${Date.now()}`,
      notes: { userId, credits: String(credits) },
    }),
  });

  if (!response.ok) {
    throw new Error("Razorpay could not create the payment order.");
  }

  const order = (await response.json()) as {
    id: string;
    amount: number;
    currency: string;
  };

  await db.razorpayTransaction.create({
    data: {
      orderId: order.id,
      userId,
      credits,
      amount: order.amount,
    },
  });

  return {
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
}
