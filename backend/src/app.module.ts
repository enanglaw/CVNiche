import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ResumeModule } from './resume/resume.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { JobModule } from './job/job.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    ResumeModule,
    PortfolioModule,
    JobModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
