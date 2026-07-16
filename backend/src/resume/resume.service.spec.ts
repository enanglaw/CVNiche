import { Test, TestingModule } from '@nestjs/testing';
import { ResumeService } from './resume.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ResumeService', () => {
  let service: ResumeService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    resume: {
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createResume', () => {
    it('should clone an existing resume when sourceResumeId is provided', async () => {
      const mockUser = { id: 'user-1', plan: 'PRO' };
      const mockSourceResume = {
        id: 'source-1',
        title: 'Original Title',
        templateId: 'modern_dev',
        targetJobTitle: 'Senior Software Engineer',
        content: {
          experience: [{ company: 'Google', position: 'SWE' }],
          education: [],
          skills: ['Node.js'],
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.resume.findFirst.mockResolvedValue(mockSourceResume);
      mockPrismaService.resume.create.mockImplementation(({ data }: any) => {
        return {
          id: 'new-clone-id',
          ...data,
        };
      });

      const result = await service.createResume('user-1', {
        title: 'Cloned Resume',
        sourceResumeId: 'source-1',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-1' } });
      expect(prisma.resume.findFirst).toHaveBeenCalledWith({
        where: { id: 'source-1', userId: 'user-1' },
      });
      expect(prisma.resume.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          title: 'Cloned Resume',
          templateId: 'modern_dev',
          targetJobTitle: 'Senior Software Engineer',
          content: mockSourceResume.content,
        }),
        include: { versions: true },
      });
      expect(result.title).toBe('Cloned Resume');
      expect(result.templateId).toBe('modern_dev');
    });

    it('should create a template-based resume when no sourceResumeId is provided', async () => {
      const mockUser = { id: 'user-1', plan: 'PRO' };
      const mockContent = { experience: [], education: [], skills: ['React'] };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.resume.create.mockImplementation(({ data }: any) => {
        return {
          id: 'new-resume-id',
          ...data,
        };
      });

      const result = await service.createResume('user-1', {
        title: 'New Resume',
        templateId: 'creative',
        content: mockContent,
        targetJobTitle: 'UI Designer',
      });

      expect(prisma.resume.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          title: 'New Resume',
          templateId: 'creative',
          targetJobTitle: 'UI Designer',
          content: mockContent,
        }),
        include: { versions: true },
      });
      expect(result.title).toBe('New Resume');
      expect(result.templateId).toBe('creative');
    });
  });

  describe('exportResume download limits', () => {
    it('should allow a FREE user to download once a month and then block subsequent downloads', async () => {
      const mockUser = { id: 'user-1', plan: 'FREE', lastDownloadAt: null };
      const mockResume = {
        id: 'resume-1',
        title: 'Test Resume',
        templateId: 'classic',
        content: { name: 'John Doe', skills: [] },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.resume.findFirst.mockResolvedValue(mockResume);

      // First export should succeed and update lastDownloadAt
      const result = await service.exportResume('user-1', 'resume-1', 'json');
      expect(result).toEqual(mockResume.content);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { lastDownloadAt: expect.any(Date) },
      });

      // Subsequent export within same month should fail
      const mockUserDownloaded = { id: 'user-1', plan: 'FREE', lastDownloadAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserDownloaded);

      await expect(service.exportResume('user-1', 'resume-1', 'json')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow a PRO user to download multiple times', async () => {
      const mockUser = { id: 'user-1', plan: 'PRO', lastDownloadAt: new Date() };
      const mockResume = {
        id: 'resume-1',
        title: 'Test Resume',
        templateId: 'classic',
        content: { name: 'John Doe', skills: [] },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.resume.findFirst.mockResolvedValue(mockResume);

      const result = await service.exportResume('user-1', 'resume-1', 'json');
      expect(result).toEqual(mockResume.content);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('updateResume edit limits', () => {
    it('should allow a FREE user to edit up to 3 times, then block', async () => {
      const mockUser = { id: 'user-1', plan: 'FREE', editsThisMonth: 2, lastEditResetAt: new Date() };
      const mockResume = {
        id: 'resume-1',
        title: 'Old Title',
        content: { skills: ['React'] },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.resume.findFirst.mockResolvedValue(mockResume);
      mockPrismaService.resume.update.mockResolvedValue({ id: 'resume-1', title: 'New Title' });

      // 3rd edit should succeed
      await service.updateResume('user-1', 'resume-1', { title: 'New Title' });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { editsThisMonth: 3, lastEditResetAt: expect.any(Date) },
      });

      // 4th edit should fail
      const mockUserMaxed = { id: 'user-1', plan: 'FREE', editsThisMonth: 3, lastEditResetAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserMaxed);

      await expect(service.updateResume('user-1', 'resume-1', { title: 'Brand New Title' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow a PRO user to edit without limits', async () => {
      const mockUser = { id: 'user-1', plan: 'PRO', editsThisMonth: 100, lastEditResetAt: new Date() };
      const mockResume = {
        id: 'resume-1',
        title: 'Old Title',
        content: { skills: ['React'] },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.resume.findFirst.mockResolvedValue(mockResume);
      mockPrismaService.resume.update.mockResolvedValue({ id: 'resume-1', title: 'New Title' });

      await service.updateResume('user-1', 'resume-1', { title: 'New Title' });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
