import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding admin user...');

  // ============================================
  // CREATE ADMIN USER ONLY
  // ============================================
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartgharjagga.com' },
    update: {},
    create: {
      email: 'admin@smartgharjagga.com',
      passwordHash: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
      isVerified: true,
      isEmailVerified: true,
      isActive: true,
    },
  });
  
  console.log('✅ Admin created successfully!');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: Admin@123`);
  console.log(`🆔 User ID: ${admin.id}`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });