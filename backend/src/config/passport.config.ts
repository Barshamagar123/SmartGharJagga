// src/config/passport.config.ts

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from './index';

const prisma = new PrismaClient();

// Configure Google Strategy with your credentials
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log('Google Profile:', profile); // Debug log

        // Extract user info from Google profile
        const { id: googleId, emails, displayName, photos } = profile;

        // Validate email
        if (!emails || emails.length === 0) {
          return done(new Error('No email found from Google'), undefined);
        }

        const email = emails[0].value;
        const name = displayName || email.split('@')[0];
        const avatarUrl = photos && photos.length > 0 ? photos[0].value : undefined;

        // Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // If not found by Google ID, check by email
        if (!user) {
          user = await prisma.user.findUnique({
            where: { email },
          });

          // If user exists with same email but no Google ID, link them
          if (user) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId,
                isEmailVerified: true,
                avatarUrl: avatarUrl || user.avatarUrl,
              },
            });
          } else {
            // Create new user
            const randomPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
              data: {
                email,
                name,
                googleId,
                avatarUrl: avatarUrl || null,
                passwordHash: hashedPassword,
                isEmailVerified: true,
                role: 'BUYER',
                isActive: true,
              },
            });
          }
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return done(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, undefined);
      }
    }
  )
);

// Serialize user for session (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;