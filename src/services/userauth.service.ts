import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, VerifyResetCodeInput } from '../interface/userauth.interface';


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
  private transporter;

  

  constructor() {

    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // logger: true, 
      // debug: true,
    });

    

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP configuration error:', error);
      } else {
        console.log('SMTP configuration successful:');
      }
    });
     
    this.initializeAdmin();

  }

  // Initialize admin manually
  private async initializeAdmin() {
    const adminEmail = 'charitynyawirairungu@gmail.com';
    const adminPassword = 'charity1234'; // Replace with a strong password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        await prisma.user.create({
          data: {
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
          },
        });
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
    }
  }

  // Register a new user
  async register({ name, email, password }: RegisterInput) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return user;
  }

  // Login user
  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }

  // Forgot password
  async forgotPassword({ email }: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { email },
      data: { resetCode, resetCodeExpiry: new Date(Date.now() + 3600000) },
    });

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is ${resetCode}.`,
    });

    return { message: 'Password reset code sent' };
  }

  // Verify reset code
  async verifyResetCode({ email, code }: VerifyResetCodeInput) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetCode !== code || user.resetCodeExpiry! < new Date()) {
      throw new Error('Invalid or expired reset code');
    }
    return { message: 'Reset code verified' };
  }

  // Reset password
  async resetPassword({ email, newPassword }: ResetPasswordInput) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetCode: null, resetCodeExpiry: null },
    });
    return { message: 'Password reset successful' };
  }

  // Change role (admin only)
  async changeRole(adminId: string, userId: string, newRole: 'customer' | 'client') {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admin can change roles');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent changing the admin's role
    if (user.role === 'admin') {
      throw new Error('Cannot change the role of the admin');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return updatedUser;
  }

  // Get all users with details
  async getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  // Delete a user
  async deleteUser(adminId: string, userId: string) {
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'admin') {
      throw new Error('Only admin can delete users');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({ where: { id: userId } });
    return { message: `User with ID ${userId} deleted successfully` };
  }
}