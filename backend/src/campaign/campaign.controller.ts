import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";

@Controller("campaigns")
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async getCampaigns() {
    return this.campaignService.getCampaigns();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post("broadcast")
  async broadcast(@Body() body: { title: string; channel: string; adCopy: string }) {
    return this.campaignService.broadcastCampaign(body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get("analytics")
  async getAnalytics() {
    return this.campaignService.getChannelAnalytics();
  }

  @Post("click")
  async click(@Body("utmSource") utmSource: string) {
    if (!utmSource) return { success: false, message: "utmSource is required" };
    return this.campaignService.recordClick(utmSource);
  }
}
