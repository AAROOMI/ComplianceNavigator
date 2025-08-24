import { Router, Request, Response } from 'express';
import { storage } from './storage';
import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  generateSessionToken,
  getRolePermissions,
  defaultUsers,
  extractTokenFromHeader,
  type AuthenticatedUser
} from './auth-utils';

const router = Router();

// Initialize default users if none exist
async function initializeDefaultUsers() {
  try {
    const existingUsers = await storage.getUsersManagement();
    if (existingUsers.length === 0) {
      console.log('Initializing default users...');
      
      for (const defaultUser of defaultUsers) {
        const hashedPassword = await hashPassword(defaultUser.password);
        const permissions = getRolePermissions(defaultUser.role);
        
        await storage.createUserManagement({
          username: defaultUser.username,
          email: defaultUser.email,
          passwordHash: hashedPassword,
          firstName: defaultUser.firstName,
          lastName: defaultUser.lastName,
          role: defaultUser.role,
          department: defaultUser.department,
          status: defaultUser.status,
          permissions,
          isActive: true,
          phoneNumber: null,
          preferences: {}
        });
      }
      
      console.log('Default users initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
}

// Initialize on module load
initializeDefaultUsers();

// Authentication middleware
export async function requireAuth(req: Request, res: Response, next: any) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const user = await storage.getUserManagement(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    // Attach user to request
    (req as any).user = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      permissions: user.permissions || []
    } as AuthenticatedUser;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Permission middleware
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: any) => {
    const user = (req as any).user as AuthenticatedUser;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super admin has all permissions
    if (user.permissions.includes('admin')) {
      return next();
    }

    if (!user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username
    const user = await storage.getUserManagementByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.username, user.role);

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await storage.createUserSession({
      userId: user.id,
      token: sessionToken,
      expiresAt
    });

    // Update last login would need to be added to the schema interface if needed

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      permissions: user.permissions || [],
      lastLogin: new Date()
    };

    res.json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup endpoint
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, role, department } = req.body;

    if (!username || !email || !password || !firstName || !lastName || !role || !department) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username already exists
    const existingUsername = await storage.getUserManagementByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await storage.getUserManagementByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Get default permissions for role
    const permissions = getRolePermissions(role);

    // Create user
    const newUser = await storage.createUserManagement({
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      department,
      status: 'Active',
      permissions,
      isActive: true,
      phoneNumber: null,
      preferences: {}
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.username, newUser.role);

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await storage.createUserSession({
      userId: newUser.id,
      token: sessionToken,
      expiresAt
    });

    // Return user data (without password)
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      department: newUser.department,
      permissions: newUser.permissions || []
    };

    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', requireAuth, async (req: Request, res: Response) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      // Delete session if it exists
      try {
        await storage.deleteUserSession(token);
      } catch (error) {
        // Session might not exist, that's fine
      }
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthenticatedUser;
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const user = await storage.getUserManagement(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      permissions: user.permissions || []
    };

    res.json({ valid: true, user: userResponse });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

export default router;