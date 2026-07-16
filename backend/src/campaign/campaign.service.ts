import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Broadcasts / Simulates dispatching ad copy to developer ad portals (Meta, X, TikTok)
   */
  async broadcastCampaign(data: { title: string; channel: string; adCopy: string }) {
    const channelLower = data.channel.toLowerCase();
    const landingUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/?utm_source=${channelLower}`;

    // 1. Create campaign in DB
    const campaign = await this.prisma.adCampaign.create({
      data: {
        title: data.title,
        channel: channelLower,
        adCopy: data.adCopy,
        targetUrl: landingUrl,
      },
    });

    // 2. Simulate broadcast payload dispatch to social platform developer webhooks
    this.logger.log(`[Ad Broadcast] Dispatching to ${data.channel} Ads API Webhook...`);
    this.logger.log(`[Ad Payload] URL: ${landingUrl} | Copy: "${data.adCopy}"`);
    
    // Simulate API network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { 
      success: true, 
      campaign,
      message: `Simulated ad broadcast dispatched successfully to ${data.channel} Developer API Portal.` 
    };
  }

  /**
   * Lists campaigns
   */
  async getCampaigns() {
    return this.prisma.adCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Increments the click counter for campaigns of a channel when a user lands on the homepage
   */
  async recordClick(utmSource: string) {
    const channelLower = utmSource.trim().toLowerCase();
    
    const campaigns = await this.prisma.adCampaign.findMany({
      where: { channel: channelLower },
    });

    if (campaigns.length === 0) {
      // Create a default campaign placeholder if user landed via organic social link
      await this.prisma.adCampaign.create({
        data: {
          title: `Organic ${utmSource} Entry`,
          channel: channelLower,
          adCopy: "User redirected via organic channel links.",
          targetUrl: `http://localhost:3000/?utm_source=${channelLower}`,
          clicks: 1,
        },
      });
      return { success: true };
    }

    for (const campaign of campaigns) {
      await this.prisma.adCampaign.update({
        where: { id: campaign.id },
        data: { clicks: { increment: 1 } },
      });
    }

    this.logger.log(`Incremented ad click statistics for channel: ${channelLower}`);
    return { success: true };
  }

  /**
   * Groups campaign performance metrics by channel (Facebook, X, TikTok, LinkedIn)
   */
  async getChannelAnalytics() {
    const channels = ["facebook", "x", "tiktok", "linkedin"];
    const results = [];

    for (const channel of channels) {
      // Gather statistics from active campaigns
      const campaigns = await this.prisma.adCampaign.findMany({
        where: { channel },
      });

      const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
      const totalSignups = campaigns.reduce((acc, c) => acc + c.signups, 0);
      const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);

      // Conversions: Count Pro users from this channel
      const activeProSubscribers = await this.prisma.user.count({
        where: {
          utmSource: channel,
          plan: "PRO"
        }
      });

      const conversionRate = totalClicks > 0 
        ? Number(((activeProSubscribers / totalClicks) * 100).toFixed(2)) 
        : 0.0;

      results.push({
        channel: channel.charAt(0).toUpperCase() + channel.slice(1),
        clicks: totalClicks,
        signups: totalSignups,
        conversions: activeProSubscribers,
        revenue: totalRevenue,
        conversionRate,
      });
    }

    return results;
  }
}
