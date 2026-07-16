import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request, Response } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { AuthGuard } from '../auth/auth.guard';


@Controller('resume')
@UseGuards(AuthGuard)
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Get()
  async listResumes(@Request() req: any) {
    return this.resumeService.listResumes(req.user.sub);
  }

  @Post()
  async createResume(@Request() req: any, @Body() body: any) {
    return this.resumeService.createResume(req.user.sub, body);
  }

  @Get(':id')
  async getResume(@Request() req: any, @Param('id') id: string) {
    return this.resumeService.getResume(req.user.sub, id);
  }

  @Put(':id')
  async updateResume(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.resumeService.updateResume(req.user.sub, id, body);
  }

  @Delete(':id')
  async deleteResume(@Request() req: any, @Param('id') id: string) {
    return this.resumeService.deleteResume(req.user.sub, id);
  }

  @Get(':id/export')
  async exportResume(
    @Request() req: any,
    @Param('id') id: string,
    @Query('format') format: string,
    @Response() res: any,
  ) {
    const result = await this.resumeService.exportResume(req.user.sub, id, format || 'json');

    if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      return res.send(result);
    }

    return res.json(result);
  }
}
