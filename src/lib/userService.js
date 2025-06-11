import clientPromise from './mongodb.js';
import { hashPassword, verifyPassword } from './auth.js';
import CONFIG from '../../config.js';

// Get database instance
async function getDB() {
  const client = await clientPromise;
  return client.db(CONFIG.DATABASE.NAME);
}

// Create new user
export async function createUser(userData) {
  try {
    const db = await getDB();
    const users = db.collection(CONFIG.DATABASE.COLLECTIONS.USERS);
    
    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Create user object
    const newUser = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: "editor",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    // Insert user
    const result = await users.insertOne(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return {
      _id: result.insertedId,
      ...userWithoutPassword
    };
  } catch (error) {
    throw error;
  }
}

// Authenticate user (login)
export async function authenticateUser(email, password) {
  try {
    const db = await getDB();
    const users = db.collection(CONFIG.DATABASE.COLLECTIONS.USERS);
    
    // Find user by email
    const user = await users.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
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
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const db = await getDB();
    const users = db.collection(CONFIG.DATABASE.COLLECTIONS.USERS);
    
    const user = await users.findOne({ 
      _id: userId,
      isActive: true 
    });
    
    if (!user) return null;
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    const db = await getDB();
    const users = db.collection(CONFIG.DATABASE.COLLECTIONS.USERS);
    
    const user = await users.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });
    
    if (!user) return null;
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
}