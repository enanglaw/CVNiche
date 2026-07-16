import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get('public/:slug')
  async getPublicPortfolio(@Param('slug') slug: string) {
    return this.portfolioService.getPublicPortfolio(slug);
  }

  @Get()
  @UseGuards(AuthGuard)
  async listPortfolios(@Request() req: any) {
    return this.portfolioService.listPortfolios(req.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPortfolio(@Request() req: any, @Body() body: any) {
    return this.portfolioService.createPortfolio(req.user.sub, body);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getPortfolio(@Request() req: any, @Param('id') id: string) {
    return this.portfolioService.getPortfolio(req.user.sub, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updatePortfolio(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.portfolioService.updatePortfolio(req.user.sub, id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePortfolio(@Request() req: any, @Param('id') id: string) {
    return this.portfolioService.deletePortfolio(req.user.sub, id);
  }
}
