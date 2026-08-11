// // src/pages/Subscription/components/FeatureComparison.tsx

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import Card, { CardContent } from '../common/Card/Card';


// const FeatureComparison: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');

//   const comparisonData = FeatureComparison[activeTab];

//   return (
//     <Card variant="elevated" padding="lg" className="border border-[var(--color-primary-border)] max-w-5xl mx-auto">
//       <CardContent>
//         <h3 className="text-2xl font-bold text-[var(--color-text-primary)] text-center mb-6">
//           Feature Comparison
//         </h3>

//         {/* Tabs */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button
//             onClick={() => setActiveTab('seller')}
//             className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
//               activeTab === 'seller'
//                 ? 'bg-[#2D5A27] text-white'
//                 : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
//             }`}
//           >
//             📊 Seller Plans
//           </button>
//           <button
//             onClick={() => setActiveTab('buyer')}
//             className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
//               activeTab === 'buyer'
//                 ? 'bg-[#2D5A27] text-white'
//                 : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
//             }`}
//           >
//             🛒 Buyer Plans
//           </button>
//         </div>

//         {/* Comparison Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-[var(--color-primary-border)]">
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
//                   Features
//                 </th>
//                 <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
//                   Free
//                 </th>
//                 <th className="text-center py-3 px-4 text-sm font-semibold text-[#D4AF37]">
//                   Premium
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {comparisonData.map((item, index) => (
//                 <motion.tr
//                   key={index}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className={`border-b border-[var(--color-primary-border)] ${
//                     index % 2 === 0 ? 'bg-[var(--color-primary-surface)]' : 'bg-white'
//                   }`}
//                 >
//                   <td className="py-3 px-4 text-sm font-medium text-[var(--color-text-primary)]">
//                     {item.feature}
//                   </td>
//                   <td className="text-center py-3 px-4 text-sm text-[var(--color-text-secondary)]">
//                     {item.free}
//                   </td>
//                   <td className="text-center py-3 px-4 text-sm font-semibold text-[#2D5A27]">
//                     {item.premium}
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default FeatureComparison;