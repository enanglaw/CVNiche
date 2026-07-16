import { Controller, Post, Get, Body, Req, UseGuards, Param, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post("create-checkout")
  async createCheckout(
    @Req() req: any, 
    @Body("plan") plan: "PRO",
    @Body("utmSource") utmSource?: string
  ) {
    // req.user is set by AuthGuard
    const userId = req.user.id;
    return this.paymentService.createCheckoutSession(userId, plan || "PRO", utmSource);
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

  @UseGuards(AuthGuard)
  @Get("transactions")
  async getTransactions(@Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.getTransactions(userId);
  }

  @UseGuards(AuthGuard)
  @Get("invoice/:paymentId")
  async getInvoice(
    @Req() req: any,
    @Param("paymentId") paymentId: string,
    @Res() res: any
  ) {
    const userId = req.user.id;
    const role = req.user.role;
    const html = await this.paymentService.generateInvoiceHtml(paymentId, userId, role);
    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  }
}
