import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('ats/analyze')
  async analyzeATS(@Request() req: any, @Body() body: { resumeId: string; jobId: string }) {
    return this.aiService.analyzeATS(req.user.sub, body.resumeId, body.jobId);
  }

  @Post('ats/tailor')
  async tailorResume(@Request() req: any, @Body() body: { resumeId: string; jobId: string }) {
    return this.aiService.tailorResume(req.user.sub, body.resumeId, body.jobId);
  }

  @Post('linkedin/optimize')
  async optimizeLinkedIn(@Request() req: any) {
    return this.aiService.optimizeLinkedIn(req.user.sub);
  }

  @Post('coach/chat')
  async getCoachResponse(
    @Request() req: any,
    @Body() body: { chatId: string; message: string },
  ) {
    return this.aiService.getCoachResponse(req.user.sub, body.chatId, body.message);
  }

  @Get('intelligence')
  async getCareerIntelligence(@Request() req: any) {
    return this.aiService.getCareerIntelligence(req.user.sub);
  }
}
