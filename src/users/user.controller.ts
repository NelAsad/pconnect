// src/users/user.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Post('validate-otp')
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto.email, dto.otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.userService.resendOtp(dto.email);
  }
  
}
