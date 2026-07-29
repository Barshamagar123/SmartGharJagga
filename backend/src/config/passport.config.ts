// src/config/passport.config.ts (Updated)

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from './index';

const prisma = new PrismaClient();

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
        const { id: googleId, emails, displayName, photos } = profile;

        if (!emails || emails.length === 0) {
          return done(new Error('No email found from Google'), undefined);
        }

        const email = emails[0].value;
        const name = displayName || email.split('@')[0];
        const avatarUrl = photos && photos.length > 0 ? photos[0].value : undefined;

        // ✅ Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        let isNewUser = false;

        // If not found by Google ID, check by email
        if (!user) {
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // ✅ Existing user - link Google account
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId,
                isEmailVerified: true,
                avatarUrl: avatarUrl || user.avatarUrl,
              },
            });
          } else {
            // ✅ New user - create with default BUYER role
            isNewUser = true;
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
                role: 'BUYER', // ✅ Default role
                isActive: true,
              },
            });
          }
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // ✅ Pass isNewUser flag to frontend
        return done(null, { ...user, isNewUser });
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;