/**
 * Stripe webhook handler
 * Verifies webhook signatures and processes Stripe events
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Update subscription record
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const subscriptionData = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (subscriptionData) {
    const periodEnd = (subscription as any).current_period_end;
    const currentPeriodEnd = periodEnd
      ? new Date(periodEnd * 1000)
      : null;

    await prisma.subscription.update({
      where: { id: subscriptionData.id },
      data: {
        stripeSubId: subscription.id,
        status: subscription.status,
        currentPeriodEnd,
      },
    });

    console.log(`Subscription created: ${subscription.id}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionData = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id },
  });

  if (subscriptionData) {
    // Determine new tier based on price
    const firstItem = subscription.items.data[0];
    const priceId = typeof firstItem?.price === 'string'
      ? firstItem.price
      : firstItem?.price?.id;

    let newTier: 'RECRUIT' | 'OPERATOR' | 'EMPIRE' | 'CUSTOM' = 'RECRUIT';

    if (priceId === process.env.STRIPE_OPERATOR_PRICE_ID) {
      newTier = 'OPERATOR';
    } else if (priceId === process.env.STRIPE_EMPIRE_PRICE_ID) {
      newTier = 'EMPIRE';
    }

    const periodEnd = (subscription as any).current_period_end;
    const currentPeriodEnd = periodEnd
      ? new Date(periodEnd * 1000)
      : null;

    await prisma.subscription.update({
      where: { id: subscriptionData.id },
      data: {
        tier: newTier,
        status: subscription.status,
        currentPeriodEnd,
      },
    });

    console.log(`Subscription updated: ${subscription.id} -> ${newTier}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionData = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id },
  });

  if (subscriptionData) {
    await prisma.subscription.update({
      where: { id: subscriptionData.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    });

    console.log(`Subscription canceled: ${subscription.id}`);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;

  if (customerId) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (subscription) {
      // Update subscription status
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'active' },
      });

      console.log(`Payment succeeded for ${customerId}`);
    }
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : invoice.customer?.id;

  if (customerId) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (subscription) {
      // Update subscription status
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'past_due' },
      });

      console.log(`Payment failed for ${customerId}`);
    }
  }
}
