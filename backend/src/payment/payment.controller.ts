import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post("create-checkout")
  async createCheckout(@Req() req: any, @Body("plan") plan: "PRO") {
    // req.user is set by AuthGuard
    const userId = req.user.id;
    return this.paymentService.createCheckoutSession(userId, plan || "PRO");
  }

  @UseGuards(AuthGuard)
  @Get("subscription-status")
  async getStatus(@Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.getSubscription(userId);
  }

  @UseGuards(AuthGuard)
  @Post("cancel-subscription")
  async cancelSubscription(@Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.cancelSubscription(userId);
  }
}
