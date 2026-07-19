import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addPending() {
  try {
    console.log('🔍 Adding PENDING to enum...');
    
    // Try to add PENDING
    await prisma.$executeRaw`
      ALTER TYPE "SubscriptionStatus" ADD VALUE 'PENDING'
    `;
    console.log('✅ PENDING added successfully!');
    
    // Verify
    const result = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::"SubscriptionStatus")) AS enum_value
    `;
    console.log('📋 Enum values:', result);
    
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('⚠️ PENDING already exists in enum');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addPending();