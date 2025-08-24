import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'metaworks-secret-key-2024';
const TOKEN_EXPIRY = '24h';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT token generation and verification
export function generateToken(userId: number, username: string, role: string): string {
  return jwt.sign(
    { 
      userId, 
      username, 
      role,
      type: 'access_token'
    }, 
    JWT_SECRET, 
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Session token generation
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Role-based permission checking
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  if (!userPermissions) return false;
  
  // Super admin has all permissions
  if (userPermissions.includes('admin')) {
    return true;
  }
  
  // Check specific permission
  return userPermissions.includes(requiredPermission);
}

export function getRolePermissions(role: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    'Super Admin': ['read', 'write', 'delete', 'admin', 'user_management', 'system_config'],
    'CISO': ['read', 'write', 'delete', 'policy_management', 'risk_assessment', 'compliance'],
    'IT Manager': ['read', 'write', 'it_management', 'infrastructure', 'user_support'],
    'Security Analyst': ['read', 'write', 'risk_assessment', 'vulnerability_management'],
    'Auditor': ['read', 'audit', 'compliance', 'reporting'],
    'Employee': ['read'],
  };
  
  return rolePermissions[role] || ['read'];
}

// Default users for initial setup
export const defaultUsers = [
  {
    username: 'admin',
    email: 'admin@metaworks.com',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'Super Admin',
    department: 'Information Technology',
    status: 'Active'
  },
  {
    username: 'ciso',
    email: 'ciso@metaworks.com',
    password: 'ciso123',
    firstName: 'Chief Information',
    lastName: 'Security Officer',
    role: 'CISO',
    department: 'Cybersecurity',
    status: 'Active'
  },
  {
    username: 'itmanager',
    email: 'itmanager@metaworks.com',
    password: 'it123',
    firstName: 'IT',
    lastName: 'Manager',
    role: 'IT Manager',
    department: 'Information Technology',
    status: 'Active'
  },
  {
    username: 'analyst',
    email: 'analyst@metaworks.com',
    password: 'analyst123',
    firstName: 'Security',
    lastName: 'Analyst',
    role: 'Security Analyst',
    department: 'Cybersecurity',
    status: 'Active'
  },
  {
    username: 'auditor',
    email: 'auditor@metaworks.com',
    password: 'audit123',
    firstName: 'Compliance',
    lastName: 'Auditor',
    role: 'Auditor',
    department: 'Audit',
    status: 'Active'
  }
];

// Authentication middleware
export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  department?: string;
  permissions: string[];
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}