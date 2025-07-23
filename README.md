# HabitFlow - Advanced Habit Tracker

A modern, feature-rich habit tracking application built with React, TypeScript, Tailwind CSS, and Firebase. HabitFlow combines traditional habit tracking with innovative features like RPG progression, habit chaining, mood correlation, and smart streak recovery.

## 🚀 Features

### Core Functionality
- **Complete Authentication System** - Email/password and Google OAuth
- **Advanced Habit Management** - Multiple habit types (boolean, counter, duration)
- **Daily Tracking** - Intuitive dashboard with progress visualization
- **RPG System** - XP, levels, health, energy, and badges
- **Habit Chaining** - Connect related habits in sequences
- **Smart Streak Recovery** - Grace periods and recovery challenges
- **Mood Correlation** - Track mood/energy impact of habits
- **Progressive Web App** - Offline-first with notifications

### Advanced Features
- **Dark/Light Theme** - Automatic system preference detection
- **Responsive Design** - Mobile-first approach
- **Real-time Sync** - Multi-device synchronization
- **Offline Support** - Works without internet connection
- **Performance Optimized** - Code splitting and lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, FCM)
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   ├── habit/           # Habit-specific components
│   ├── rpg/             # RPG system components
│   └── analytics/       # Analytics and charts
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── pages/               # Page components
├── lib/                 # Utility functions
├── types/               # TypeScript interfaces
└── styles/              # Global styles
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Auth and Firestore enabled

### 1. Clone and Install
```bash
git clone <repository-url>
cd habitflow
npm install
```

### 2. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google providers)
3. Create Firestore database in production mode
4. Copy your Firebase config and update `src/lib/firebase.ts`

### 3. Environment Setup
Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Run Development Server
```bash
npm run dev
```

## 📱 Usage Guide

### Getting Started
1. **Sign Up/Login** - Create an account or sign in with Google
2. **Create Your First Habit** - Click "New Habit" and fill in the details
3. **Track Daily** - Mark habits as complete from the dashboard
4. **Monitor Progress** - View your XP, level, and completion rates

### Advanced Features

#### RPG System
- Earn XP by completing habits (difficulty-based multipliers)
- Level up and unlock badges
- Manage health and energy resources
- Critical habits affect your health bar

#### Habit Chaining
- Create sequences of related habits
- Automatic timer between chain steps
- Bonus XP for completing entire chains
- Visual flow representation

#### Mood Correlation
- Daily mood and energy tracking
- Correlation analysis with habit completion
- Insights into habit impact on well-being

#### Smart Streak Recovery
- 24-hour grace period for late completions
- Recovery challenges for broken streaks
- "Sick mode" for temporary pauses

## 🔐 Security Features

- Firebase Authentication with secure rules
- Client-side form validation with Zod
- Protected routes and API calls
- Firestore security rules for data isolation

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)
- **Neutral**: Gray scale for backgrounds and text

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale from 12px to 48px
- **Weights**: 300-800 range for hierarchy

### Components
- Glass-morphism effects with backdrop blur
- Smooth animations and micro-interactions
- Consistent spacing using 8px grid system
- Mobile-first responsive breakpoints

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 2s on 3G networks
- **Offline Support**: Full functionality without internet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style (Prettier + ESLint)
- Write tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@habitflow.app
- 🐛 Bug Reports: [GitHub Issues](https://github.com/username/habitflow/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/username/habitflow/discussions)

## 🗺️ Roadmap

### Q1 2024
- [ ] Social features and friend challenges
- [ ] Advanced analytics dashboard
- [ ] Habit templates and community sharing
- [ ] iOS/Android mobile apps

### Q2 2024
- [ ] AI-powered habit suggestions
- [ ] Integration with wearables (Fitbit, Apple Watch)
- [ ] Advanced streak algorithms
- [ ] Habit coaching and tips

### Q3 2024
- [ ] Team challenges and leaderboards
- [ ] Export/import data features
- [ ] Third-party integrations (Notion, Todoist)
- [ ] Advanced notification system

---

Built with ❤️ by the HabitFlow team# rhabit
