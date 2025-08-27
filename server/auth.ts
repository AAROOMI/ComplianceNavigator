import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { UsersManagement } from "@shared/schema";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  department?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      // Find user by username
      const users = await storage.getUsersManagement();
      const user = users.find(u => u.username === credentials.username && u.isActive);
      
      if (!user) {
        return null;
      }

      // For demo purposes, we'll use simple password matching
      // In production, you'd use bcrypt.compare(credentials.password, user.hashedPassword)
      const validPassword = await this.validatePassword(credentials.password, user.username);
      
      if (!validPassword) {
        return null;
      }

      // Update last login
      await storage.updateUserManagement(user.id, {
        lastLogin: new Date()
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role,
        department: user.department || undefined
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  private async validatePassword(password: string, username: string): Promise<boolean> {
    // Demo credentials - in production, use bcrypt.compare
    const demoCredentials = {
      'sarah.chen': 'admin123',
      'mike.thompson': 'password123',
      'alexandra.rodriguez': 'cto2024',
      'david.kim': 'sysadmin123',
      'emma.watson': 'user123'
    };

    return demoCredentials[username as keyof typeof demoCredentials] === password;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async validatePasswordHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}