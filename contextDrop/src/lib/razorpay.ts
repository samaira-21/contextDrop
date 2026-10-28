import { createHmac, timingSafeEqual } from "node:crypto";

import { db } from "@/server/db";

function razorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.");
  }

  return { keyId, keySecret };
}

function signatureMatches(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function verifyCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  const { keySecret } = razorpayCredentials();
  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return signatureMatches(expected, signature);
}

export function verifyWebhookSignature(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("Set RAZORPAY_WEBHOOK_SECRET in .env.");

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return signatureMatches(expected, signature);
}

export async function creditPaidOrder(input: {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
}) {
  if (input.currency !== "INR") throw new Error("Unexpected payment currency.");

  return db.$transaction(async (tx) => {
    const order = await tx.razorpayTransaction.findUnique({
      where: { orderId: input.orderId },
    });

    if (!order) throw new Error("Unknown Razorpay order.");
    if (order.amount !== input.amount) throw new Error("Payment amount mismatch.");
    if (order.status === "paid") return { alreadyPaid: true };

    const claimed = await tx.razorpayTransaction.updateMany({
      where: { id: order.id, status: "created" },
      data: { status: "paid", paymentId: input.paymentId },
    });

    if (claimed.count === 0) {
      const current = await tx.razorpayTransaction.findUnique({
        where: { orderId: input.orderId },
      });
      if (current?.status === "paid") return { alreadyPaid: true };
      throw new Error("Could not confirm this payment.");
    }

    await tx.user.update({
      where: { id: order.userId },
      data: { credits: { increment: order.credits } },
    });

    return { alreadyPaid: false };
  });
}

export { razorpayCredentials };
