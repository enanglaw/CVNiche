import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Plan } from "@prisma/client";
import Stripe from "stripe";

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe | null = null;

  constructor(private prisma: PrismaService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.startsWith("your-")) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: "2024-06-20" as any,
      });
      this.logger.log("Stripe initialized successfully.");
    } else {
      this.logger.warn("Stripe Secret Key missing or placeholder. Running payments in Mock Mode.");
    }
  }

  // Affordable pricing configuration
  readonly PLANS = {
    FREE: {
      name: "Basic Access",
      price: 0,
      interval: "monthly",
    },
    PRO: {
      name: "Pro Career Tier",
      price: 1.99, // Highly affordable pricing to democratize career growth tools
      interval: "monthly",
      stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly_199",
    }
  };

  /**
   * Creates a checkout session or returns a simulated upgrade token in Mock mode
   */
  async createCheckoutSession(userId: string, targetPlan: "PRO") {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Stripe Mode
    if (this.stripe) {
      try {
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: this.PLANS[targetPlan].stripePriceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/pricing`,
          metadata: {
            userId,
            plan: targetPlan,
          },
        });

        return { url: session.url, mock: false };
      } catch (err: any) {
        this.logger.error(`Stripe session creation failed: ${err.message}`);
        throw new Error(`Stripe checkout initialization failed: ${err.message}`);
      }
    }

    // Mock Developer Mode - Auto-upgrade user to PRO immediately for ease of testing
    this.logger.log(`[Mock Payment] Simulating successful upgrade to PRO for user ${userId}`);
    
    // Create/Update Subscription in DB
    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: Plan.PRO,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      create: {
        userId,
        plan: Plan.PRO,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Update User Plan
    await this.prisma.user.update({
      where: { id: userId },
      data: { plan: Plan.PRO },
    });

    return { 
      url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/?payment=mock_success`, 
      mock: true 
    };
  }

  /**
   * Gets current subscription status for a user
   */
  async getSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    return sub || { plan: Plan.FREE, status: "inactive" };
  }

  /**
   * Opt-out / cancel subscription at will
   */
  async cancelSubscription(userId: string) {
    await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: Plan.FREE,
        status: "canceled",
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { plan: Plan.FREE },
    });

    this.logger.log(`User ${userId} opted-out/canceled subscription.`);
    return { success: true, message: "Subscription successfully canceled. Account downgraded to Free." };
  }

  /**
   * Stripe Webhook processor to handle actual asynchronous payment events
   */
  async handleWebhook(sig: string, body: Buffer) {
    if (!this.stripe) return { received: true };

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return { received: true };

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as Plan;

      if (userId && plan) {
        await this.prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: "active",
            stripeCustomerId: session.customer as string,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          create: {
            userId,
            plan,
            status: "active",
            stripeCustomerId: session.customer as string,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: { plan },
        });

        this.logger.log(`Successfully upgraded user ${userId} to ${plan} via Webhook`);
      }
    }

    return { received: true };
  }
}
