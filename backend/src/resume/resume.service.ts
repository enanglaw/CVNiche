import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async createResume(userId: String, data: { title: string; templateId?: string; content?: any; targetJobTitle?: string; sourceResumeId?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: String(userId) },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.plan === 'FREE') {
      const count = await this.prisma.resume.count({
        where: { userId: String(userId) },
      });
      if (count >= 1) {
        throw new ForbiddenException('Upgrade to Pro to build unlimited resumes.');
      }
    }

    let content = data.content || { experience: [], education: [], skills: [] };
    let templateId = data.templateId || 'classic';
    let targetJobTitle = data.targetJobTitle;

    if (data.sourceResumeId) {
      const source = await this.prisma.resume.findFirst({
        where: { id: data.sourceResumeId, userId: String(userId) },
      });
      if (!source) {
        throw new NotFoundException('Source resume not found');
      }
      content = source.content as any;
      templateId = source.templateId;
      targetJobTitle = source.targetJobTitle || undefined;
    }

    return this.prisma.resume.create({
      data: {
        userId: String(userId),
        title: data.title,
        templateId,
        content,
        targetJobTitle,
        versions: {
          create: {
            versionNumber: 1,
            content,
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
    const user = await this.prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.plan === 'FREE') {
      const now = new Date();
      let shouldIncrementEdit = false;

      if (
        (data.content && JSON.stringify(data.content) !== JSON.stringify(resume.content)) ||
        (data.title && data.title !== resume.title) ||
        (data.templateId && data.templateId !== resume.templateId) ||
        (data.targetJobTitle && data.targetJobTitle !== resume.targetJobTitle)
      ) {
        shouldIncrementEdit = true;
      }

      if (shouldIncrementEdit) {
        let editsCount = user.editsThisMonth;
        let lastEditResetAt = user.lastEditResetAt;

        if (
          !lastEditResetAt ||
          new Date(lastEditResetAt).getMonth() !== now.getMonth() ||
          new Date(lastEditResetAt).getFullYear() !== now.getFullYear()
        ) {
          editsCount = 0;
          lastEditResetAt = now;
        }

        if (editsCount >= 3) {
          throw new ForbiddenException('Free tier users are limited to 3 edits per month. Upgrade to Pro for unlimited edits.');
        }

        await this.prisma.user.update({
          where: { id: String(userId) },
          data: {
            editsThisMonth: editsCount + 1,
            lastEditResetAt,
          },
        });
      }
    }

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

    const user = await this.prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.plan === 'FREE') {
      if (user.lastDownloadAt) {
        const lastDownload = new Date(user.lastDownloadAt);
        const now = new Date();
        if (lastDownload.getMonth() === now.getMonth() && lastDownload.getFullYear() === now.getFullYear()) {
          throw new ForbiddenException('Free tier users are limited to 1 download per month. Upgrade to Pro for unlimited downloads.');
        }
      }

      await this.prisma.user.update({
        where: { id: String(userId) },
        data: { lastDownloadAt: new Date() },
      });
    }

    if (format === 'json') {
      return content;
    }

    // Determine styles based on templateId
    let styles = '';
    if (resume.templateId === 'modern_dev') {
      styles = `
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; color: #1f2937; margin: 40px auto; max-width: 800px; padding: 0 20px; }
        h1 { margin-bottom: 5px; text-align: left; font-size: 2.2em; font-weight: 800; color: #111827; letter-spacing: -0.025em; }
        .contact { text-align: left; margin-bottom: 30px; font-size: 0.9em; color: #4b5563; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; }
        .contact a { color: #3b82f6; text-decoration: none; font-weight: 500; }
        .section-title { font-size: 1.1em; margin-top: 25px; margin-bottom: 15px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; }
        .section-title::after { content: ''; flex: 1; margin-left: 15px; height: 1px; background: #e5e7eb; }
        .item { margin-bottom: 20px; }
        .item-header { display: flex; justify-content: space-between; font-weight: 700; color: #111827; font-size: 1.05em; }
        .item-sub { display: flex; justify-content: space-between; font-weight: 500; font-size: 0.95em; color: #4b5563; margin-bottom: 6px; }
        .skills-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
        .skill-badge { background: #f3f4f6; color: #374151; padding: 3px 10px; border-radius: 6px; font-size: 0.85em; font-weight: 500; border: 1px solid #e5e7eb; display: inline-block; }
        p { margin-top: 5px; margin-bottom: 5px; color: #374151; font-size: 0.95em; }
      `;
    } else if (resume.templateId === 'executive') {
      styles = `
        body { font-family: 'Garamond', 'Georgia', serif; line-height: 1.5; color: #2d3748; margin: 40px auto; max-width: 850px; padding: 0 20px; }
        h1 { margin-bottom: 5px; text-align: center; font-size: 2.4em; font-weight: bold; color: #1a202c; letter-spacing: -0.01em; }
        .contact { text-align: center; margin-bottom: 25px; font-size: 0.95em; color: #4a5568; font-style: italic; border-bottom: 1.5px solid #718096; padding-bottom: 10px; }
        .contact a { color: #2d3748; text-decoration: underline; }
        .section-title { font-size: 1.15em; border-bottom: 1.5px solid #2d3748; margin-top: 30px; margin-bottom: 12px; text-transform: uppercase; font-weight: bold; color: #1a202c; letter-spacing: 0.05em; }
        .item { margin-bottom: 22px; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; color: #2d3748; }
        .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 0.95em; color: #4a5568; margin-bottom: 5px; }
        p { margin-top: 5px; margin-bottom: 5px; text-align: justify; font-size: 1em; }
      `;
    } else if (resume.templateId === 'creative') {
      styles = `
        body { font-family: 'Montserrat', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #2c3e50; margin: 40px auto; max-width: 800px; padding: 0 20px; }
        h1 { margin-bottom: 5px; text-align: left; font-size: 2.5em; font-weight: 900; color: #0f172a; text-transform: uppercase; }
        .contact { text-align: left; margin-bottom: 30px; font-size: 0.9em; color: #64748b; border-left: 4px solid #06b6d4; padding-left: 15px; margin-top: 10px; }
        .contact a { color: #06b6d4; text-decoration: none; font-weight: bold; }
        .section-title { font-size: 1.2em; color: #06b6d4; margin-top: 25px; margin-bottom: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; text-transform: uppercase; }
        .item { margin-bottom: 20px; position: relative; }
        .item-header { display: flex; justify-content: space-between; font-weight: 800; color: #1e293b; }
        .item-sub { display: flex; justify-content: space-between; font-weight: 600; color: #64748b; font-size: 0.9em; margin-bottom: 6px; }
        .skills-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .skill-badge { background: rgba(6, 182, 212, 0.08); color: #0891b2; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 600; border: 1px solid rgba(6, 182, 212, 0.15); display: inline-block; }
        p { margin-top: 5px; margin-bottom: 5px; color: #334155; }
      `;
    } else {
      // Classic layout
      styles = `
        body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: #333; margin: 40px auto; max-width: 800px; }
        h1 { margin-bottom: 5px; text-align: center; font-size: 2em; text-transform: uppercase; letter-spacing: 0.5px; }
        .contact { text-align: center; margin-bottom: 20px; font-size: 0.9em; }
        .contact a { color: #333; text-decoration: none; }
        .section-title { font-size: 1.1em; border-bottom: 1px solid #333; margin-top: 20px; margin-bottom: 10px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; }
        .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 0.95em; margin-bottom: 5px; }
        p { margin-top: 5px; margin-bottom: 5px; }
      `;
    }

    // Render as a clean, basic ATS-friendly HTML template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${resume.title}</title>
        <style>
          ${styles}
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
          ${resume.templateId === 'modern_dev' || resume.templateId === 'creative' ? `
            <div class="skills-container">
              ${content.skills.map((s: string) => `<span class="skill-badge">${s}</span>`).join('')}
            </div>
          ` : `
            <p>${content.skills.join(', ')}</p>
          `}
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
