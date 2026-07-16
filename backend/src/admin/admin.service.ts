import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Plan } from "@prisma/client";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  // Mock in-memory support queue for demonstration
  private supportTickets = [
    { id: "ticket-1", userEmail: "alice@gmail.com", subject: "Custom Domain Mapping Setup", status: "OPEN", category: "Technical", createdAt: new Date(Date.now() - 4 * 3600000) },
    { id: "ticket-2", userEmail: "bob@yahoo.com", subject: "Billing Query - Stripe failed checkout", status: "OPEN", category: "Billing", createdAt: new Date(Date.now() - 10 * 3600000) },
    { id: "ticket-3", userEmail: "charlie@outlook.com", subject: "ATS Scan feedback alignment", status: "RESOLVED", category: "AI Support", createdAt: new Date(Date.now() - 48 * 3600000) }
  ];

  /**
   * Computes high-level business intelligence metrics
   */
  async getMetrics() {
    const totalUsers = await this.prisma.user.count();
    const activeSubscribers = await this.prisma.user.count({
      where: { plan: Plan.PRO }
    });

    const payments = await this.prisma.payment.findMany({
      where: { status: "succeeded" }
    });
    const totalRevenue = payments.reduce((acc, pay) => acc + pay.amount, 0);

    // Compute simulated Monthly Recurring Revenue (MRR) based on Pro plan cost ($3.99/mo)
    const mrr = activeSubscribers * 3.99;

    return {
      totalUsers,
      activeSubscribers,
      mrr,
      totalRevenue,
      churnRate: 1.4, // Percentage
      conversionRate: totalUsers > 0 ? Number(((activeSubscribers / totalUsers) * 100).toFixed(1)) : 0
    };
  }

  /**
   * Lists transactions from DB
   */
  async getPayments() {
    return this.prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      take: 50
    });
  }

  /**
   * Lists registered users
   */
  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        plan: true,
        createdAt: true
      }
    });
  }

  /**
   * Manually overrides a user's subscription tier
   */
  async overrideUserPlan(targetUserId: string, plan: Plan) {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Update User
    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { plan },
      select: { id: true, email: true, plan: true }
    });

    // Sync corresponding Subscription record
    await this.prisma.subscription.upsert({
      where: { userId: targetUserId },
      update: {
        plan,
        status: plan === Plan.FREE ? "canceled" : "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      create: {
        userId: targetUserId,
        plan,
        status: plan === Plan.FREE ? "canceled" : "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    this.logger.log(`Admin manually overrode plan of user ${targetUserId} to ${plan}`);
    return updatedUser;
  }

  /**
   * Support ticket management
   */
  getSupportTickets() {
    return this.supportTickets;
  }

  resolveSupportTicket(ticketId: string) {
    const ticket = this.supportTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }
    ticket.status = "RESOLVED";
    return ticket;
  }
}
