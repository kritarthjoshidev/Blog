import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getIsConnected } from '../config/db.js';
import { memoryStore } from '../config/memoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_blog_platform_jwt_key_2026'
      );

      if (getIsConnected()) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'User belonging to this token no longer exists' });
        }
        req.user = user;
      } else {
        const user = memoryStore.users.find((u) => u._id === decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'User belonging to this token no longer exists' });
        }
        const { password, ...safeUser } = user;
        req.user = safeUser;
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no bearer token provided' });
  }
};
