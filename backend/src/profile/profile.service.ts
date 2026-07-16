import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfileByUserId(userId: string) {
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        experiences: { orderBy: { order: 'asc' } },
        education: { orderBy: { startDate: 'desc' } },
        skills: true,
        projects: true,
        certificates: { orderBy: { issueDate: 'desc' } },
      },
    });

    if (!profile) {
      // Lazy initialize profile if somehow it does not exist
      profile = await this.prisma.profile.create({
        data: {
          userId,
          headline: 'Professional',
          summary: 'Experienced professional.',
        },
        include: {
          experiences: true,
          education: true,
          skills: true,
          projects: true,
          certificates: true,
        },
      });
    }
    return profile;
  }

  async updateProfile(userId: string, data: { headline?: string; summary?: string; links?: any; metadata?: any }) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        headline: data.headline,
        summary: data.summary,
        links: data.links,
        metadata: data.metadata,
      },
    });
  }

  // Experience management
  async addExperience(userId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    return this.prisma.experience.create({
      data: {
        profileId: profile.id,
        company: data.company,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent || false,
        location: data.location,
        description: data.description,
        order: data.order || 0,
      },
    });
  }

  async updateExperience(userId: string, experienceId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    const exp = await this.prisma.experience.findFirst({
      where: { id: experienceId, profileId: profile.id },
    });
    if (!exp) throw new NotFoundException('Experience not found');

    return this.prisma.experience.update({
      where: { id: experienceId },
      data: {
        company: data.company,
        position: data.position,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : (data.isCurrent ? null : undefined),
        isCurrent: data.isCurrent,
        location: data.location,
        description: data.description,
        order: data.order,
        improvedBullets: data.improvedBullets,
      },
    });
  }

  async deleteExperience(userId: string, experienceId: string) {
    const profile = await this.getProfileByUserId(userId);
    const exp = await this.prisma.experience.findFirst({
      where: { id: experienceId, profileId: profile.id },
    });
    if (!exp) throw new NotFoundException('Experience not found');

    return this.prisma.experience.delete({ where: { id: experienceId } });
  }

  // Education management
  async addEducation(userId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    return this.prisma.education.create({
      data: {
        profileId: profile.id,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        gpa: data.gpa,
        location: data.location,
        description: data.description,
      },
    });
  }

  async updateEducation(userId: string, educationId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    const edu = await this.prisma.education.findFirst({
      where: { id: educationId, profileId: profile.id },
    });
    if (!edu) throw new NotFoundException('Education item not found');

    return this.prisma.education.update({
      where: { id: educationId },
      data: {
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        gpa: data.gpa,
        location: data.location,
        description: data.description,
      },
    });
  }

  async deleteEducation(userId: string, educationId: string) {
    const profile = await this.getProfileByUserId(userId);
    const edu = await this.prisma.education.findFirst({
      where: { id: educationId, profileId: profile.id },
    });
    if (!edu) throw new NotFoundException('Education item not found');

    return this.prisma.education.delete({ where: { id: educationId } });
  }

  // Skills management
  async addSkill(userId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    return this.prisma.skill.create({
      data: {
        profileId: profile.id,
        name: data.name,
        category: data.category,
        level: data.level,
      },
    });
  }

  async deleteSkill(userId: string, skillId: string) {
    const profile = await this.getProfileByUserId(userId);
    const skill = await this.prisma.skill.findFirst({
      where: { id: skillId, profileId: profile.id },
    });
    if (!skill) throw new NotFoundException('Skill not found');

    return this.prisma.skill.delete({ where: { id: skillId } });
  }

  // Projects management
  async addProject(userId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    return this.prisma.project.create({
      data: {
        profileId: profile.id,
        name: data.name,
        description: data.description,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        achievements: data.achievements || [],
        metrics: data.metrics,
      },
    });
  }

  async updateProject(userId: string, projectId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    const proj = await this.prisma.project.findFirst({
      where: { id: projectId, profileId: profile.id },
    });
    if (!proj) throw new NotFoundException('Project not found');

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        achievements: data.achievements,
        metrics: data.metrics,
      },
    });
  }

  async deleteProject(userId: string, projectId: string) {
    const profile = await this.getProfileByUserId(userId);
    const proj = await this.prisma.project.findFirst({
      where: { id: projectId, profileId: profile.id },
    });
    if (!proj) throw new NotFoundException('Project not found');

    return this.prisma.project.delete({ where: { id: projectId } });
  }

  // Certificates management
  async addCertificate(userId: string, data: any) {
    const profile = await this.getProfileByUserId(userId);
    return this.prisma.certificate.create({
      data: {
        profileId: profile.id,
        name: data.name,
        issuer: data.issuer,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        credentialId: data.credentialId,
        url: data.url,
      },
    });
  }

  async deleteCertificate(userId: string, certificateId: string) {
    const profile = await this.getProfileByUserId(userId);
    const cert = await this.prisma.certificate.findFirst({
      where: { id: certificateId, profileId: profile.id },
    });
    if (!cert) throw new NotFoundException('Certificate not found');

    return this.prisma.certificate.delete({ where: { id: certificateId } });
  }
}
