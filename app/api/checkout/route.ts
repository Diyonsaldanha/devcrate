import { getStripeClient } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { FREE_SHIPPING_CENTS, PROMO_RATES, SHIPPING_CENTS } from "@/lib/pricing";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return Response.json(
      { error: "Stripe test mode is not configured. Add an sk_test_ key to .env.local." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Checkout request must be valid JSON." }, { status: 400 });
  }

  if (!isRecord(body) || !isRecord(body.lines) || Object.keys(body.lines).length === 0) {
    return Response.json({ error: "Your bag is empty or invalid." }, { status: 400 });
  }

  const promoCode = body.promoCode;
  if (
    promoCode !== undefined &&
    promoCode !== null &&
    (typeof promoCode !== "string" || !Object.hasOwn(PROMO_RATES, promoCode))
  ) {
    return Response.json({ error: "That promo code is invalid." }, { status: 400 });
  }

  const rate = typeof promoCode === "string" && Object.hasOwn(PROMO_RATES, promoCode)
    ? PROMO_RATES[promoCode]
    : 0;
  const lineItems: Array<{
    quantity: number;
    price_data: {
      currency: "usd";
      unit_amount: number;
      product_data: { name: string };
    };
  }> = [];
  let subtotalCents = 0;

  for (const [slug, quantity] of Object.entries(body.lines)) {
    const product = getProduct(slug);
    if (
      !product ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return Response.json({ error: "Your bag contains an invalid item or quantity." }, { status: 400 });
    }

    const unitAmount = Math.round(product.price * 100 * (1 - rate));
    subtotalCents += unitAmount * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: unitAmount,
        product_data: { name: product.name },
      },
    });
  }

  const shippingCents = subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingCents, currency: "usd" },
            display_name: shippingCents === 0 ? "Free shipping" : "Standard shipping",
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?checkout=cancelled`,
    });

    if (!session.url) {
      console.error("Stripe Checkout session did not return a redirect URL.");
      return Response.json({ error: "Stripe could not start checkout. Please try again." }, { status: 502 });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout session creation failed:", error);
    return Response.json({ error: "Stripe could not start checkout. Please try again." }, { status: 502 });
  }
}
