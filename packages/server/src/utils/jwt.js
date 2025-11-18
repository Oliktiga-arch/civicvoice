import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

/**
 * Generate a JWT token
 * @param payload - JWT payload
 * @returns JWT token string
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};