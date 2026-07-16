import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private prisma: PrismaService) {}

  async analyzeATS(userId: string, resumeId: string, jobId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });
    const job = await this.prisma.jobDescription.findUnique({
      where: { id: jobId },
    });

    if (!resume || !job) {
      throw new HttpException('Resume or Job not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Call FastAPI
      const response = await axios.post(`${this.aiServiceUrl}/api/ats/analyze`, {
        resume_content: resume.content,
        job_description: job.descriptionText,
      });

      const analysis = response.data;

      // Save to database
      return this.prisma.aTSAnalysis.create({
        data: {
          resumeId,
          jobDescriptionId: jobId,
          score: analysis.score || 70,
          missingKeywords: analysis.missing_keywords || [],
          weakSections: analysis.weak_sections || [],
          suggestions: analysis.suggestions || {},
        },
      });
    } catch (err) {
      this.logger.warn(`FastAPI call failed, running mock ATS Analysis: ${err.message}`);
      // Fallback Mock
      const mockScore = Math.floor(Math.random() * 20) + 75; // 75-95
      return this.prisma.aTSAnalysis.create({
        data: {
          resumeId,
          jobDescriptionId: jobId,
          score: mockScore,
          missingKeywords: ['Docker', 'Next.js', 'System Architecture', 'CI/CD Pipelines'],
          weakSections: ['Work Experience Bullet Points', 'Technical Skills categorization'],
          suggestions: {
            phrasing: 'Ensure experience bullets follow the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).',
            formatting: 'Remove multi-column layout for better ATS parseability. Avoid icons in section headers.',
            actionVerbs: 'Use stronger action verbs such as Engineered, Spearheaded, Orchestrated instead of Helped or Managed.',
          },
        },
      });
    }
  }

  async tailorResume(userId: string, resumeId: string, jobId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });
    const job = await this.prisma.jobDescription.findUnique({
      where: { id: jobId },
    });

    if (!resume || !job) {
      throw new HttpException('Resume or Job not found', HttpStatus.NOT_FOUND);
    }

    try {
      const response = await axios.post(`${this.aiServiceUrl}/api/ats/tailor`, {
        resume_content: resume.content,
        job_description: job.descriptionText,
      });
      const tailoredContent = response.data.tailored_content;

      return this.prisma.resume.create({
        data: {
          userId,
          title: `${resume.title} (Tailored for ${job.company})`,
          templateId: resume.templateId,
          content: tailoredContent,
          targetJobTitle: job.title,
          matchScore: response.data.estimated_score || 90,
        },
      });
    } catch (err) {
      this.logger.warn(`FastAPI call failed, running mock tailoring: ${err.message}`);
      
      const content = resume.content as any;
      const tailoredContent = {
        ...content,
        summary: `Results-driven Software Engineer with enhanced focus on ${job.title} requirements at ${job.company}. Specializing in building robust systems, cloud deployments, and optimizing API performance.`,
        skills: [...(content.skills || []), 'Tailored APIs', 'Scalability', 'System Design'],
      };

      return this.prisma.resume.create({
        data: {
          userId,
          title: `${resume.title} (Tailored for ${job.company})`,
          templateId: resume.templateId,
          content: tailoredContent,
          targetJobTitle: job.title,
          matchScore: 88,
        },
      });
    }
  }

  async optimizeLinkedIn(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { experiences: true, skills: true },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    try {
      const response = await axios.post(`${this.aiServiceUrl}/api/linkedin/optimize`, {
        profile,
      });
      return response.data;
    } catch (err) {
      this.logger.warn(`FastAPI LinkedIn call failed, returning mock improvements: ${err.message}`);
      
      const firstName = profile.headline?.split(' ')[0] || 'Professional';
      return {
        headline: `Senior Software Engineer | Node.js | FastAPI | PostgreSQL | Building Scale & Performance`,
        about: `Passionate engineer specializing in highly scalable microservices, backend system design, and database optimizations. Experienced in cloud operations (AWS, GCP) and leading agile development teams.`,
        experience_improvements: profile.experiences.map((exp) => ({
          id: exp.id,
          company: exp.company,
          original: exp.description,
          improved: `Spearheaded software engineering initiatives, driving a 25% performance improvement in API latency and migrating legacy systems to microservices.`,
        })),
        seo_score: 85,
        network_tips: [
          'Add a professional, friendly headline rather than just a job title.',
          'Connect with at least 5 professionals working in target companies weekly.',
          'Post articles or brief thoughts about backend scaling to showcase expertise.',
        ],
      };
    }
  }

  async getCoachResponse(userId: string, chatId: string, message: string) {
    let chat = await this.prisma.aIChat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      chat = await this.prisma.aIChat.create({
        data: {
          id: chatId,
          userId,
          title: 'Career Coaching Session',
          messages: [],
        },
      });
    }

    const messages = chat.messages as any[];
    const updatedMessages = [...messages, { role: 'user', content: message, timestamp: new Date() }];

    let reply = '';
    try {
      const response = await axios.post(`${this.aiServiceUrl}/api/coach/chat`, {
        messages: updatedMessages,
      });
      reply = response.data.reply;
    } catch (err) {
      this.logger.warn(`FastAPI Coach failed, returning fallback advice: ${err.message}`);
      reply = `Thank you for reaching out! To improve your interview chances, I recommend tailoring your resume to target keywords. Would you like me to rewrite your professional summary or prepare some mock questions for you?`;
    }

    const finalMessages = [...updatedMessages, { role: 'model', content: reply, timestamp: new Date() }];

    await this.prisma.aIChat.update({
      where: { id: chat.id },
      data: {
        messages: finalMessages,
        title: messages.length === 0 ? message.substring(0, 30) : undefined,
      },
    });

    return { reply, chat };
  }

  async getCareerIntelligence(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { skills: true },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    const userSkills = profile.skills.map((s) => s.name);

    return {
      dnaScore: 82,
      scores: {
        resume: 80,
        linkedin: 75,
        portfolio: 90,
        ats: 84,
      },
      skillGap: {
        missing: ['Kubernetes', 'GraphQL', 'System Design', 'CI/CD Pipelines'],
        target: 'Senior backend roles',
      },
      roadmap: [
        {
          step: 1,
          title: 'Master Container Orchestration',
          description: 'Acquire Docker and Kubernetes knowledge. Get the CKA certificate.',
          resource: 'Kubernetes for Developers (Certified Kubernetes Application Developer)',
        },
        {
          step: 2,
          title: 'Build Advanced Portfolio Project',
          description: 'Deploy a multi-service NestJS & Python project with Redis and vector search.',
          resource: 'Local GitHub Portfolio Project',
        },
      ],
      salaryPotential: {
        currentAverage: '$95,000',
        targetAverage: '$135,000',
        growthPotential: '42%',
      },
      certifications: [
        { name: 'Google Cloud Professional Cloud Architect', url: 'https://cloud.google.com/learn/certification' },
        { name: 'Certified Kubernetes Application Developer (CKAD)', url: 'https://training.linuxfoundation.org/' },
      ],
    };
  }
}
