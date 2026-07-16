import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { email, password, firstName, lastName, utmSource } = body;
    return this.authService.register(email, password, firstName, lastName, utmSource);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}
