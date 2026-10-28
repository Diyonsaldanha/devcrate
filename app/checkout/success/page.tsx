import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import CheckoutSuccess from "@/components/CheckoutSuccess";
import { getStripeClient } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order confirmed · Devcrate" };

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="empty-state">
          <div className="empty-state-mark" aria-hidden="true">…</div>
          <h1 className="empty-state-title">Checking your payment.</h1>
          <p className="empty-state-copy">Just a moment while we confirm your order.</p>
        </div>
      }
    >
      <CheckoutVerification searchParams={searchParams} />
    </Suspense>
  );
}

async function CheckoutVerification({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  // The Stripe SDK reads Date.now(), so wait for a real request before using it.
  await connection();
  const stripe = getStripeClient();

  if (!stripe || !sessionId) {
    return (
      <div className="empty-state">
        <div className="empty-state-mark" aria-hidden="true">!</div>
        <h1 className="empty-state-title">We couldn’t verify that checkout.</h1>
        <p className="empty-state-copy">Your order hasn’t been confirmed. Please check your bag and try again.</p>
        <Link href="/cart" className="button-primary">Return to your bag</Link>
      </div>
    );
  }

  let paymentStatus: string | null = null;
  let verificationFailed = false;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paymentStatus = session.payment_status;
  } catch (error) {
    console.error("Stripe Checkout session verification failed:", error);
    verificationFailed = true;
  }

  if (verificationFailed) {
    return (
      <div className="empty-state">
        <div className="empty-state-mark" aria-hidden="true">!</div>
        <h1 className="empty-state-title">We couldn’t verify that checkout.</h1>
        <p className="empty-state-copy">Your order hasn’t been confirmed. Please check your bag and try again.</p>
        <Link href="/cart" className="button-primary">Return to your bag</Link>
      </div>
    );
  }

  if (paymentStatus !== "paid") {
    return (
      <div className="empty-state">
        <div className="empty-state-mark" aria-hidden="true">…</div>
        <h1 className="empty-state-title">Payment isn’t confirmed yet.</h1>
        <p className="empty-state-copy">Your bag is still here if you’d like to try again.</p>
        <Link href="/cart" className="button-primary">Return to your bag</Link>
      </div>
    );
  }

  return <CheckoutSuccess />;
}
