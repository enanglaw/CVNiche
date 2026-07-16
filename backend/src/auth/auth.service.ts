import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, firstName?: string, lastName?: string, utmSource?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        utmSource,
        profile: {
          create: {
            headline: firstName && lastName ? `${firstName} ${lastName}` : 'Professional',
            summary: 'Experienced professional eager to contribute.',
          },
        },
        subscription: {
          create: {
            plan: 'FREE',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days free trial/placeholder
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // If there is an active Campaign matching the UTM source channel, increment its signup conversions
    if (utmSource) {
      const channelLabel = utmSource.trim();
      const campaigns = await this.prisma.adCampaign.findMany({
        where: {
          channel: {
            equals: channelLabel,
            mode: "insensitive"
          }
        }
      });
      for (const campaign of campaigns) {
        await this.prisma.adCampaign.update({
          where: { id: campaign.id },
          data: { signups: { increment: 1 } }
        });
      }
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        plan: user.plan,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { passwordHash: _, ...result } = user;
    return result;
  }
}
