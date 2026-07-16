import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";
import { Plan } from "@prisma/client";

@Controller("admin")
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("metrics")
  async getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get("payments")
  async getPayments() {
    return this.adminService.getPayments();
  }

  @Get("users")
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Post("users/override-plan")
  async overridePlan(
    @Body("userId") userId: string,
    @Body("plan") plan: Plan
  ) {
    return this.adminService.overrideUserPlan(userId, plan);
  }

  @Get("support-tickets")
  getTickets() {
    return this.adminService.getSupportTickets();
  }

  @Post("support-tickets/:id/resolve")
  resolveTicket(@Param("id") id: string) {
    return this.adminService.resolveSupportTicket(id);
  }
}
