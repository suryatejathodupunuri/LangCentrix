import { prisma } from './prisma.js';
import { hashPassword, verifyPassword } from './auth.js';

// Create new user
export async function createUser(userData) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() }
    });
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: "Editor",
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        isActive: true
      }
    });
    
    return {
      _id: newUser.id, // Keep _id for backward compatibility
      ...newUser
    };
  } catch (error) {
    throw error;
  }
}

// Authenticate user (login) - Keep for backward compatibility
export async function authenticateUser(email, password) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
        isActive: true 
      }
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLogin: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Return user without password, with _id for backward compatibility
    const { password: _, ...userWithoutPassword } = user;
    return {
      _id: user.id,
      ...userWithoutPassword
    };
  } catch (error) {
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        isActive: true
      }
    });
    
    if (!user) return null;
    
    // Return with _id for backward compatibility
    return {
      _id: user.id,
      ...user
    };
  } catch (error) {
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        isActive: true
      }
    });
    
    if (!user) return null;
    
    // Return with _id for backward compatibility
    return {
      _id: user.id,
      ...user
    };
  } catch (error) {
    throw error;
  }
}