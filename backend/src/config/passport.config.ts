// src/config/passport.config.ts

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from './index';

// ✅ Debug: Check if config values are loaded
console.log('\n🔍 Google OAuth Config Check:');
console.log('GOOGLE_CLIENT_ID:', config.GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ MISSING');
console.log('GOOGLE_CLIENT_SECRET:', config.GOOGLE_CLIENT_SECRET ? '✅ Loaded' : '❌ MISSING');
console.log('GOOGLE_CALLBACK_URL:', config.GOOGLE_CALLBACK_URL || '❌ MISSING');

// ✅ Validate credentials before creating strategy
if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
  console.error('\n❌ Google OAuth credentials are missing!');
  console.error('Please check your .env file and config/index.ts');
  console.error('GOOGLE_CLIENT_ID:', config.GOOGLE_CLIENT_ID);
  console.error('GOOGLE_CLIENT_SECRET:', config.GOOGLE_CLIENT_SECRET ? '********' : 'undefined');
  
  // Don't exit process, just log error and continue
  // The strategy will fail gracefully
} else {
  console.log('✅ Google OAuth credentials validated successfully!\n');
}

const prisma = new PrismaClient();

// Configure Google Strategy with your credentials
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID || 'missing_client_id',
      clientSecret: config.GOOGLE_CLIENT_SECRET || 'missing_client_secret',
      callbackURL: config.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log('✅ Google Profile received:', profile.id);

        // Extract user info from Google profile
        const { id: googleId, emails, displayName, photos } = profile;

        // Validate email
        if (!emails || emails.length === 0) {
          console.error('❌ No email found from Google profile');
          return done(new Error('No email found from Google'), undefined);
        }

        const email = emails[0].value;
        const name = displayName || email.split('@')[0];
        const avatarUrl = photos && photos.length > 0 ? photos[0].value : undefined;

        console.log(`📧 Processing Google user: ${email}`);

        // Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // If not found by Google ID, check by email
        if (!user) {
          console.log(`🔍 User not found by Google ID, checking by email: ${email}`);
          user = await prisma.user.findUnique({
            where: { email },
          });

          // If user exists with same email but no Google ID, link them
          if (user) {
            console.log(`🔗 Linking Google account to existing user: ${email}`);
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
            console.log(`🆕 Creating new user from Google: ${email}`);
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

        console.log(`✅ Google authentication successful for: ${email}`);
        return done(null, user);
      } catch (error) {
        console.error('❌ Google Strategy Error:', error);
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
    console.error('❌ Deserialize user error:', error);
    done(error, null);
  }
});

console.log('✅ Google OAuth Strategy configured successfully!\n');

export default passport;