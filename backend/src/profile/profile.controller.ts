import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('me')
  async getProfile(@Request() req: any) {
    return this.profileService.getProfileByUserId(req.user.sub);
  }

  @Put('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.profileService.updateProfile(req.user.sub, body);
  }

  // Experiences
  @Post('experience')
  async addExperience(@Request() req: any, @Body() body: any) {
    return this.profileService.addExperience(req.user.sub, body);
  }

  @Put('experience/:id')
  async updateExperience(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.profileService.updateExperience(req.user.sub, id, body);
  }

  @Delete('experience/:id')
  async deleteExperience(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deleteExperience(req.user.sub, id);
  }

  // Education
  @Post('education')
  async addEducation(@Request() req: any, @Body() body: any) {
    return this.profileService.addEducation(req.user.sub, body);
  }

  @Put('education/:id')
  async updateEducation(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.profileService.updateEducation(req.user.sub, id, body);
  }

  @Delete('education/:id')
  async deleteEducation(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deleteEducation(req.user.sub, id);
  }

  // Skills
  @Post('skill')
  async addSkill(@Request() req: any, @Body() body: any) {
    return this.profileService.addSkill(req.user.sub, body);
  }

  @Delete('skill/:id')
  async deleteSkill(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deleteSkill(req.user.sub, id);
  }

  // Projects
  @Post('project')
  async addProject(@Request() req: any, @Body() body: any) {
    return this.profileService.addProject(req.user.sub, body);
  }

  @Put('project/:id')
  async updateProject(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.profileService.updateProject(req.user.sub, id, body);
  }

  @Delete('project/:id')
  async deleteProject(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deleteProject(req.user.sub, id);
  }

  // Certificates
  @Post('certificate')
  async addCertificate(@Request() req: any, @Body() body: any) {
    return this.profileService.addCertificate(req.user.sub, body);
  }

  @Delete('certificate/:id')
  async deleteCertificate(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deleteCertificate(req.user.sub, id);
  }

  // Communication preferences (opt-in / opt-out)
  @Get('preferences')
  async getPreferences(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.profileService.getPreferences(userId);
  }

  @Put('preferences')
  async updatePreferences(
    @Request() req: any, 
    @Body() body: { notifyJobAlerts?: boolean; notifyMarketing?: boolean; notifyPromos?: boolean }
  ) {
    const userId = req.user.sub || req.user.id;
    return this.profileService.updatePreferences(userId, body);
  }
}
