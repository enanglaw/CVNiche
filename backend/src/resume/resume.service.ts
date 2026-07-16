import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}

  async listResumes(userId: String) {
    return this.prisma.resume.findMany({
      where: { userId: String(userId) },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createResume(userId: String, data: { title: string; templateId?: string; content: any; targetJobTitle?: string }) {
    return this.prisma.resume.create({
      data: {
        userId: String(userId),
        title: data.title,
        templateId: data.templateId || 'classic',
        content: data.content,
        targetJobTitle: data.targetJobTitle,
        versions: {
          create: {
            versionNumber: 1,
            content: data.content,
          },
        },
      },
      include: {
        versions: true,
      },
    });
  }

  async getResume(userId: String, id: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId: String(userId) },
      include: {
        versions: { orderBy: { versionNumber: 'desc' } },
        atsAnalyses: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }

  async updateResume(userId: String, id: string, data: { title?: string; templateId?: string; content?: any; targetJobTitle?: string; matchScore?: number }) {
    const resume = await this.getResume(userId, id);

    // Create a new version if content is changing
    let newVersion = undefined;
    if (data.content && JSON.stringify(data.content) !== JSON.stringify(resume.content)) {
      const latestVersionNum = resume.versions[0]?.versionNumber || 0;
      newVersion = {
        create: {
          versionNumber: latestVersionNum + 1,
          content: data.content,
        },
      };
    }

    return this.prisma.resume.update({
      where: { id },
      data: {
        title: data.title,
        templateId: data.templateId,
        content: data.content,
        targetJobTitle: data.targetJobTitle,
        matchScore: data.matchScore,
        versions: newVersion,
      },
      include: {
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });
  }

  async deleteResume(userId: String, id: string) {
    const resume = await this.getResume(userId, id);
    return this.prisma.resume.delete({ where: { id: resume.id } });
  }

  async exportResume(userId: String, id: string, format: string) {
    const resume = await this.getResume(userId, id);
    const content = resume.content as any;

    if (format === 'json') {
      return content;
    }

    // Render as a clean, basic ATS-friendly HTML template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${resume.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 40px; }
          h1 { margin-bottom: 5px; text-align: center; }
          .contact { text-align: center; margin-bottom: 20px; font-size: 0.9em; }
          .section-title { font-size: 1.2em; border-bottom: 1px solid #aaa; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; font-weight: bold; }
          .item { margin-bottom: 15px; }
          .item-header { display: flex; justify-content: space-between; font-weight: bold; }
          .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 0.95em; margin-bottom: 5px; }
          ul { margin-top: 5px; padding-left: 20px; }
          li { margin-bottom: 3px; }
        </style>
      </head>
      <body>
        <h1>${content.name || ''}</h1>
        <div class="contact">
          ${content.email || ''} | ${content.phone || ''} | ${content.location || ''} <br>
          ${content.website ? `<a href="${content.website}">${content.website}</a>` : ''}
        </div>
        
        ${content.summary ? `
          <div class="section-title">Professional Summary</div>
          <p>${content.summary}</p>
        ` : ''}

        ${content.experiences && content.experiences.length ? `
          <div class="section-title">Work Experience</div>
          ${content.experiences.map((exp: any) => `
            <div class="item">
              <div class="item-header">
                <span>${exp.position}</span>
                <span>${exp.location || ''}</span>
              </div>
              <div class="item-sub">
                <span>${exp.company}</span>
                <span>${exp.startDate} - ${exp.endDate || 'Present'}</span>
              </div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        ` : ''}

        ${content.education && content.education.length ? `
          <div class="section-title">Education</div>
          ${content.education.map((edu: any) => `
            <div class="item">
              <div class="item-header">
                <span>${edu.institution}</span>
                <span>${edu.location || ''}</span>
              </div>
              <div class="item-sub">
                <span>${edu.degree} in ${edu.fieldOfStudy}</span>
                <span>${edu.startDate} - ${edu.endDate || 'Present'}</span>
              </div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${content.skills && content.skills.length ? `
          <div class="section-title">Skills</div>
          <p>${content.skills.join(', ')}</p>
        ` : ''}
      </body>
      </html>
    `;

    if (format === 'html') {
      return html;
    }

    // Default returns raw content object if format unhandled
    return { html, json: content };
  }
}
