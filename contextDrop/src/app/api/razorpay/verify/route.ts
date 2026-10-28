import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/server/db";
import { creditPaidOrder, razorpayCredentials, verifyCheckoutSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payment details." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const orderId = data.razorpay_order_id;
  const paymentId = data.razorpay_payment_id;
  const signature = data.razorpay_signature;
  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return NextResponse.json({ error: "Invalid payment details." }, { status: 400 });
  }

  const order = await db.razorpayTransaction.findUnique({ where: { orderId } });
  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
    return NextResponse.json({ error: "Payment signature is invalid." }, { status: 400 });
  }

  const { keyId, keySecret } = razorpayCredentials();
  const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    cache: "no-store",
  });
  if (!paymentResponse.ok) {
    return NextResponse.json({ error: "Could not confirm payment status." }, { status: 502 });
  }

  const payment = (await paymentResponse.json()) as {
    order_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
  };
  if (
    payment.order_id !== orderId ||
    payment.amount === undefined ||
    payment.amount !== order.amount ||
    payment.status !== "captured"
  ) {
    return NextResponse.json({ error: "Payment is not captured." }, { status: 409 });
  }

  try {
    await creditPaidOrder({
      orderId,
      paymentId,
      amount: payment.amount,
      currency: payment.currency ?? "",
    });
  } catch {
    return NextResponse.json({ error: "Could not apply credits to this order." }, { status: 409 });
  }

  return NextResponse.json({ message: "Payment verified and credits added." });
}
