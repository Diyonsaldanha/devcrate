import Stripe from "stripe";

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey?.startsWith("sk_test_")) return null;
  return new Stripe(secretKey);
}
