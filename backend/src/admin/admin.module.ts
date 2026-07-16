import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, JwtService],
  exports: [AdminService],
})
export class AdminModule {}
