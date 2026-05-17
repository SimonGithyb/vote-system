import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('mail.host'),
            port: this.configService.get('mail.port'),
            auth: {
                user: this.configService.get('mail.user'),
                pass: this.configService.get('mail.pass'),
            },
        });
    }
    
    async sendPasswordResetEmail(to: string, token: string) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:8080';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;        
        const mailOptions = {
            from: 'Auth-backend service',
            to: to,
            subject: 'Password Reset Request',
            html: `<p>You request a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset the Password</a></p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }

}