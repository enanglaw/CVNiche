import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('job')
@UseGuards(AuthGuard)
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('tracker')
  async listApplications(@Request() req: any) {
    return this.jobService.listApplications(req.user.sub);
  }

  @Post('tracker')
  async addApplication(@Request() req: any, @Body() body: any) {
    return this.jobService.addApplication(req.user.sub, body);
  }

  @Get('tracker/:id')
  async getApplication(@Request() req: any, @Param('id') id: string) {
    return this.jobService.getApplication(req.user.sub, id);
  }

  @Put('tracker/:id')
  async updateApplication(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.jobService.updateApplication(req.user.sub, id, body);
  }

  @Delete('tracker/:id')
  async deleteApplication(@Request() req: any, @Param('id') id: string) {
    return this.jobService.deleteApplication(req.user.sub, id);
  }
}
