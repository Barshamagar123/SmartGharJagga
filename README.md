# 🏠 Smart GharJagga - AI-Powered Real Estate Platform

> **Smart GharJagga** is a modern, AI-powered real estate platform connecting buyers, sellers, and agents with intelligent property matching, interactive maps, QR codes, and multi-language support (Nepali/English).

---

## ✨ Key Features

### 🤖 AI-Powered Property Matching
- **Cosine Similarity Algorithm** - Matches properties with buyer preferences (0-100% match score)
- **Smart Recommendations** - AI-driven property suggestions based on user behavior
- **Learning System** - Continuously improves recommendations based on user interactions

### 🗺️ Interactive Maps
- Property markers with clickable info cards
- Heat maps for property density & price distribution
- Draw-to-search functionality
- Nearby places: Schools, hospitals, markets
- Street View integration

### 📱 QR Code System
- Unique QR code for every property
- Download as PNG, PDF, or SVG
- Scan to view property details instantly
- Verified badge integration

### 🌐 Multi-Language Support
- Full Nepali (Devanagari) support
- English support
- Auto-detect browser language
- One-click language switcher
- Remember user language preference

### 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Buyer** | View properties, save favorites, contact sellers, AI matching |
| **Seller** | List properties, manage listings, receive inquiries, premium features |
| **Admin** | Full platform control: users, properties, subscriptions, analytics |

### 💰 Monetization Model
- **Free Plan** - Basic listing, 3 photos, manual search
- **Seller Premium** - ₹4,000/mo (AI matching, featured listing, unlimited photos)
- **Buyer Premium** - ₹999/mo (unlimited AI matches, instant alerts)

---

## 📊 Feature Overview

| Category | Features | Status |
|----------|----------|--------|
| User Management | 12 features | ✅ Complete |
| Authentication | 10 features | ✅ Complete |
| Property Management | 15 features | ✅ Complete |
| AI Matching | 8 features | ✅ Complete |
| Map Features | 8 features | ✅ Complete |
| QR Code System | 4 features | ✅ Complete |
| Multi-Language | 6 features | ✅ Complete |
| Subscription/Premium | 6 features | ✅ Complete |
| Dashboard | 8 features | ✅ Complete |
| Admin Panel | 10 features | ✅ Complete |
| Business Model | 3 revenue streams | ✅ Complete |
| **TOTAL** | **90+ Features** | ✅ |

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js / Python
- **Framework**: Express.js / Django
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT (with refresh tokens & blacklisting)
- **AI/ML**: Scikit-learn / NumPy (Cosine Similarity)
- **Payments**: Khalti, eSewa, Stripe
- **File Storage**: Cloudinary

### Frontend
- **Framework**: React.js / Next.js
- **State Management**: Redux Toolkit / Context API
- **UI Library**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Google Maps API
- **QR Codes**: qrcode.js
- **I18n**: i18next
- **HTTP Client**: Axios

### DevOps & Tools
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry / LogRocket
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 16.x
Python >= 3.8 (for AI service)
PostgreSQL >= 13
npm / yarn
Docker (optional)