import { Module } from "@nestjs/common";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [CampaignController],
  providers: [CampaignService, PrismaService, JwtService],
  exports: [CampaignService],
})
export class CampaignModule {}
