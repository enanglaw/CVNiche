import { Injectable, Logger, NotFoundException, ForbiddenException } from "@nestjs/common";
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
  async createCheckoutSession(userId: string, targetPlan: "PRO", utmSource?: string) {
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
          success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/cvniche/?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/cvniche/pricing`,
          metadata: {
            userId,
            plan: targetPlan,
            utmSource: utmSource || "",
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

    const finalUtmSource = utmSource || user.utmSource;

    // Create Payment record for analytics
    await this.prisma.payment.create({
      data: {
        userId,
        amount: 3.99,
        status: "succeeded",
        transactionId: `mock-tx-${Date.now()}`,
        utmSource: finalUtmSource || null,
      },
    });

    // If user has a utmSource channel, increment its Campaign revenue
    if (finalUtmSource) {
      const campaigns = await this.prisma.adCampaign.findMany({
        where: {
          channel: {
            equals: finalUtmSource.trim(),
            mode: "insensitive"
          }
        }
      });
      for (const campaign of campaigns) {
        await this.prisma.adCampaign.update({
          where: { id: campaign.id },
          data: { revenue: { increment: 3.99 } }
        });
      }
    }

    return { 
      url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/cvniche/?payment=mock_success`, 
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

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const finalUtmSource = session.metadata?.utmSource || user?.utmSource || null;

        // Create Payment record for analytics
        await this.prisma.payment.create({
          data: {
            userId,
            amount: 3.99,
            status: "succeeded",
            transactionId: session.id,
            utmSource: finalUtmSource || null,
          },
        });

        // If user has a utmSource channel, increment its Campaign revenue
        if (finalUtmSource) {
          const campaigns = await this.prisma.adCampaign.findMany({
            where: {
              channel: {
                equals: finalUtmSource.trim(),
                mode: "insensitive"
              }
            }
          });
          for (const campaign of campaigns) {
            await this.prisma.adCampaign.update({
              where: { id: campaign.id },
              data: { revenue: { increment: 3.99 } }
            });
          }
        }

        this.logger.log(`Successfully upgraded user ${userId} to ${plan} via Webhook`);
      }
    }

    return { received: true };
  }

  /**
   * Generates a printable HTML invoice/receipt for a payment
   */
  async generateInvoiceHtml(paymentId: string, userId: string, role: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (!payment) {
      throw new NotFoundException("Invoice payment record not found.");
    }

    if (payment.userId !== userId && role !== "ADMIN") {
      throw new ForbiddenException("Unauthorized to access this invoice.");
    }

    const clientName = payment.user.firstName 
      ? `${payment.user.firstName} ${payment.user.lastName || ""}`
      : payment.user.email;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${payment.id.slice(0, 8).toUpperCase()}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; background-color: #fcfcfc; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); border-radius: 8px; font-size: 14px; background: #fff; }
          .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #8B5CF6; }
          .title { font-size: 20px; text-transform: uppercase; color: #555; }
          .details { margin-top: 30px; display: flex; justify-content: space-between; }
          .details div { width: 45%; }
          .details h4 { margin: 0 0 8px 0; color: #777; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 40px; text-align: left; }
          th { border-bottom: 2px solid #eee; padding: 10px; font-weight: bold; color: #555; }
          td { border-bottom: 1px solid #eee; padding: 12px 10px; }
          .total { text-align: right; font-weight: bold; font-size: 16px; color: #8B5CF6; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #DEF7EC; color: #03543F; text-transform: uppercase; }
          @media print {
            body { margin: 0; background: #fff; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="invoice-header">
            <div>
              <div class="logo">CVNiche AI</div>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Career Intelligence Platform</p>
            </div>
            <div style="text-align: right;">
              <div class="title">Receipt / Invoice</div>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">Invoice #: INV-${payment.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div class="details">
            <div>
              <h4>Billed To</h4>
              <strong>${clientName}</strong><br>
              ${payment.user.email}<br>
            </div>
            <div style="text-align: right;">
              <h4>Payment Details</h4>
              Date: ${new Date(payment.createdAt).toLocaleDateString()}<br>
              Method: Card Payments<br>
              Status: <span class="badge">${payment.status}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CVNiche Pro Subscription (1 Month Tier - Affordable Access)</td>
                <td style="text-align: right;">$${payment.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="total">Total Paid</td>
                <td style="text-align: right;" class="total">$${payment.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Thank you for subscribing to CVNiche. Your contribution keeps our career services affordable.<br>
            Questions? Contact support@cvniche.com
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Retrieves billing transaction histories for a specific user
   */
  async getTransactions(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
