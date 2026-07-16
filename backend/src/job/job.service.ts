import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async listApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        job: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addApplication(
    userId: string,
    data: {
      title: string;
      company: string;
      descriptionText: string;
      location?: string;
      salaryRange?: string;
      url?: string;
      resumeId?: string;
      status?: ApplicationStatus;
      notes?: string;
    },
  ) {
    // Create Job Description
    const job = await this.prisma.jobDescription.create({
      data: {
        title: data.title,
        company: data.company,
        descriptionText: data.descriptionText,
        location: data.location,
        salaryRange: data.salaryRange,
        url: data.url,
      },
    });

    // Create Application linked to job
    return this.prisma.application.create({
      data: {
        userId,
        jobDescriptionId: job.id,
        resumeId: data.resumeId,
        status: data.status || ApplicationStatus.WISHLIST,
        notes: data.notes,
        appliedDate: data.status === ApplicationStatus.APPLIED ? new Date() : null,
      },
      include: {
        job: true,
      },
    });
  }

  async getApplication(userId: string, id: string) {
    const app = await this.prisma.application.findFirst({
      where: { id, userId },
      include: { job: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateApplication(
    userId: string,
    id: string,
    data: {
      status?: ApplicationStatus;
      notes?: string;
      resumeId?: string;
      interviewDate?: string;
      appliedDate?: string;
    },
  ) {
    const app = await this.getApplication(userId, id);

    const updateData: any = {
      status: data.status,
      notes: data.notes,
      resumeId: data.resumeId,
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : undefined,
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : undefined,
    };

    if (data.status === ApplicationStatus.APPLIED && !app.appliedDate && !data.appliedDate) {
      updateData.appliedDate = new Date();
    }

    if (data.status === ApplicationStatus.INTERVIEWING && !app.interviewDate && !data.interviewDate) {
      updateData.interviewDate = new Date();
    }

    return this.prisma.application.update({
      where: { id },
      data: updateData,
      include: { job: true },
    });
  }

  async deleteApplication(userId: string, id: string) {
    const app = await this.getApplication(userId, id);
    // Delete application
    await this.prisma.application.delete({ where: { id: app.id } });
    // Cleanup orphaned job descriptions
    const otherApps = await this.prisma.application.findMany({
      where: { jobDescriptionId: app.jobDescriptionId },
    });
    if (otherApps.length === 0) {
      await this.prisma.jobDescription.delete({ where: { id: app.jobDescriptionId } });
    }
    return { success: true };
  }
}
