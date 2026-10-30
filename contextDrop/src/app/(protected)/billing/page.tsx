"use client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { createRazorpayOrder } from "@/lib/razorpay-actions";
import { INR_PAISE_PER_CREDIT } from "@/lib/pricing";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import Script from "next/script";
import React from "react";
import { toast } from "sonner";

type RazorpayCheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckout = {
  open: () => void;
  on: (event: "payment.failed", callback: () => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      handler: (response: RazorpayCheckoutResponse) => Promise<void>;
      modal: { ondismiss: () => void };
    }) => RazorpayCheckout;
  }
}

const BillingPage = () => {
  const { data: user } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100]);
  const [isLoading, setIsLoading] = React.useState(false);
  const creditsToBuyAmount = creditsToBuy[0]!;
  const price = ((creditsToBuyAmount * INR_PAISE_PER_CREDIT) / 100).toFixed(2);

  const startCheckout = async () => {
    if (!window.Razorpay) {
      toast.error("Payment checkout is still loading. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const order = await createRazorpayOrder(creditsToBuyAmount);
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Dionysus",
        description: `${creditsToBuyAmount} credits`,
        order_id: order.orderId,
        handler: async (payment) => {
          try {
            const response = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payment),
            });
            if (!response.ok) {
              const result = (await response.json()) as { error?: string };
              toast.error(result.error ?? "Payment could not be verified.");
              setIsLoading(false);
              return;
            }
            toast.success("Payment successful. Credits have been added.");
            window.location.assign("/create");
          } catch {
            toast.error("Could not verify payment. Your payment will be reconciled by webhook.");
            setIsLoading(false);
          }
        },
        modal: { ondismiss: () => setIsLoading(false) },
      });
      checkout.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setIsLoading(false);
      });
      checkout.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <h1 className="text-xl font-semibold">Billing</h1>
      <div className="h-2"></div>

      <p className="text-sm text-gray-500">
        You currently have {user?.credits} credits. <br />
        You can buy more credits below.
      </p>
      <div className="h-2"></div>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700">
        <div className="flex items-center gap-2">
          <Info className="size-4" />
          <p className="text-sm">
            Each credit allows you to index 1 file in a repository.
          </p>
        </div>
        <p className="text-sm">
          E.g: If your project has 100 files, you will need 100 credits to index
          it. <br />
        </p>
      </div>
      <div className="h-4"></div>

      <Slider
        defaultValue={[100]}
        max={1000}
        min={10}
        step={10}
        onValueChange={(value) => setCreditsToBuy(value)}
        value={creditsToBuy}
      />
      <div className="h-4"></div>

      <Button disabled={isLoading} onClick={startCheckout}>
        {isLoading ? "Starting checkout…" : `Buy ${creditsToBuyAmount} credits for ₹${price}`}
      </Button>
    </div>
  );
};

export default BillingPage;
