// src/router.ts

import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import propertyRoutes from '@/modules/property/property.routes';
import matchingRoutes from '@/modules/matching/matching.routes'; 
import mapRoutes from '@/modules/map/map.routes'; 
import qrRoutes from '@/modules/qr/qr.routes';  
import languageRoutes from '@/modules/language/language.routes';  
import subscriptionRoutes from '@/modules/subscription/subscription.routes'; 
import messageRoutes from '@/modules/message/message.routes'; 
import reviewRoutes from '@/modules/review/review.routes';
// ✅ ADD THIS IMPORT
import paymentRoutes from '@/modules/payment/payment.routes'; 
import adminRoutes from '@/modules/admin/admin.routes';
const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Smart GharJagga API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/matching', matchingRoutes);  
router.use('/map', mapRoutes); 
router.use('/qr', qrRoutes);  
router.use('/language', languageRoutes);  
router.use('/subscriptions', subscriptionRoutes); 
router.use('/messages', messageRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payments', paymentRoutes); // ✅ Now works
router.use('/admin', adminRoutes); // ✅ Register admin routes

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export { router };