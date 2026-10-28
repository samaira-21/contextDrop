import { NextResponse } from "next/server";

import { creditPaidOrder, verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature || !verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
        };
      };
    };
  };
  try {
    event = JSON.parse(body) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid webhook body." }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    return NextResponse.json({ message: "Event ignored." });
  }

  const payment = event.payload?.payment?.entity;
  if (
    !payment?.id ||
    !payment.order_id ||
    payment.amount === undefined ||
    payment.status !== "captured"
  ) {
    return NextResponse.json({ error: "Incomplete payment event." }, { status: 400 });
  }

  try {
    await creditPaidOrder({
      orderId: payment.order_id,
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency ?? "",
    });
  } catch {
    return NextResponse.json({ error: "Could not apply payment." }, { status: 409 });
  }

  return NextResponse.json({ message: "Payment applied." });
}
