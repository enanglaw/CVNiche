import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async listPortfolios(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createPortfolio(userId: string, data: { slug: string; template?: string; themeSettings?: any; customDomain?: string }) {
    const existing = await this.prisma.portfolio.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          data.customDomain ? { customDomain: data.customDomain } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (existing) {
      throw new ConflictException('Slug or Custom Domain already in use');
    }

    return this.prisma.portfolio.create({
      data: {
        userId,
        slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        template: data.template || 'minimal',
        themeSettings: data.themeSettings || {},
        customDomain: data.customDomain,
      },
    });
  }

  async getPortfolio(userId: string, id: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }

  async updatePortfolio(userId: string, id: string, data: { template?: string; isPublished?: boolean; themeSettings?: any; customDomain?: string }) {
    const portfolio = await this.getPortfolio(userId, id);

    if (data.customDomain && data.customDomain !== portfolio.customDomain) {
      const domainConflict = await this.prisma.portfolio.findUnique({
        where: { customDomain: data.customDomain },
      });
      if (domainConflict) {
        throw new ConflictException('Custom domain already in use');
      }
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        template: data.template,
        isPublished: data.isPublished,
        themeSettings: data.themeSettings,
        customDomain: data.customDomain,
      },
    });
  }

  async deletePortfolio(userId: string, id: string) {
    const portfolio = await this.getPortfolio(userId, id);
    return this.prisma.portfolio.delete({ where: { id: portfolio.id } });
  }

  // Public endpoint resolver
  async getPublicPortfolio(slug: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { slug: slug.toLowerCase(), isPublished: true },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            profile: {
              include: {
                experiences: { orderBy: { order: 'asc' } },
                education: { orderBy: { startDate: 'desc' } },
                skills: true,
                projects: true,
                certificates: true,
              },
            },
          },
        },
      },
    });

    if (!portfolio) throw new NotFoundException('Portfolio not found or private');
    return portfolio;
  }
}
