# CLAUDE.md - AI Assistant Documentation for PointRally

## 🎯 Project Overview

**PointRally** is a sports loyalty points aggregator platform that consolidates loyalty points from multiple sports teams into one unified balance, allowing fans to use their points across different teams and events.

### Core Value Proposition
- **Problem**: Sports fans have multiple team apps (Lakers, Dodgers, Rams, etc.) each with separate loyalty points that often expire unused
- **Solution**: PointRally combines all team loyalty points into one balance for cross-team usage
- **Target Users**: Sports enthusiasts who follow multiple teams across different leagues

## 🏗️ Architecture Overview

The project follows a **Clean Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│         (Components, Pages, Styles)          │
├─────────────────────────────────────────────┤
│             ViewModel Layer                  │
│        (UI State & Logic Management)         │
├─────────────────────────────────────────────┤
│             Business Layer                   │
│     (Managers & Coordinators)               │
├─────────────────────────────────────────────┤
│              Service Layer                   │
│        (External APIs & Integrations)        │
└─────────────────────────────────────────────┘
```

### Architecture Components

#### 1. **ViewModels** (`/src/viewmodels/`)
- Manage UI state and user interactions
- Bridge between UI components and business logic
- Example: `AuthViewModel` handles login/signup UI state

#### 2. **Managers** (`/src/managers/`)
- Orchestrate business logic and rules
- Coordinate between multiple services
- Example: `AuthManager` manages authentication flow

#### 3. **Coordinators** (`/src/coordinators/`)
- Handle navigation and flow control
- Manage side effects and external actions
- Example: `AuthCoordinator` decides post-login navigation

#### 4. **Services** (`/src/services/`)
- Interface with external APIs and databases
- Handle all third-party integrations
- Example: `FirebaseAuthService` handles Firebase operations

## 📁 Project Structure

```
pointrally-site/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/         # Dashboard routes
│   │   ├── auth/              # Authentication routes
│   │   ├── teams/             # Team management routes
│   │   ├── rewards/           # Rewards catalog routes
│   │   └── api/               # API endpoints
│   │       ├── auth/          # Auth endpoints
│   │       ├── users/         # User endpoints
│   │       ├── teams/         # Team endpoints
│   │       ├── points/        # Points endpoints
│   │       └── rewards/       # Rewards endpoints
│   │
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   │   ├── Button.tsx    # Button component
│   │   │   ├── Card.tsx      # Card component
│   │   │   ├── Input.tsx     # Input component
│   │   │   ├── Badge.tsx     # Badge component
│   │   │   └── Modal.tsx     # Modal component
│   │   ├── layout/           # Layout components
│   │   │   ├── Navbar.tsx    # Navigation bar
│   │   │   └── Footer.tsx    # Footer
│   │   └── features/         # Feature-specific components
│   │
│   ├── viewmodels/           # UI state management
│   │   └── AuthViewModel.ts  # Authentication UI logic
│   │
│   ├── managers/             # Business logic
│   │   └── AuthManager.ts    # Authentication business logic
│   │
│   ├── coordinators/         # Flow control
│   │   └── AuthCoordinator.ts # Auth navigation flow
│   │
│   ├── services/             # External services
│   │   └── FirebaseAuthService.ts # Firebase integration
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts        # Authentication hook
│   │
│   ├── context/              # React contexts
│   │   └── AuthContext.tsx   # Auth context provider
│   │
│   ├── lib/                  # Utilities and helpers
│   │   ├── constants.ts      # App constants
│   │   ├── utils.ts          # Utility functions
│   │   ├── validators.ts     # Input validators
│   │   └── formatters.ts     # Data formatters
│   │
│   ├── types/                # TypeScript types
│   │   ├── auth.types.ts     # Auth-related types
│   │   └── global.d.ts       # Global type definitions
│   │
│   └── styles/               # Additional styles
│
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── CLAUDE.md               # This file
```

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 15.5.3 | React framework with App Router |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **State Management** | React Context + ViewModels | Application state |
| **Authentication** | Firebase Auth (planned) | User authentication |
| **Database** | TBD | Data persistence |
| **Package Manager** | npm | Dependency management |
| **Linting** | ESLint 9 | Code quality |

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "15.5.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^19",
    "@types/node": "^20",
    "tailwindcss": "^4",
    "eslint": "^9"
  }
}
```

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run all checks before committing
npm run type-check && npm run lint && npm run build
```

## 🎨 Component Library

### UI Components

| Component | Location | Props | Description |
|-----------|----------|-------|-------------|
| **Button** | `/components/ui/Button.tsx` | variant, size, isLoading, leftIcon, rightIcon | Versatile button with multiple variants |
| **Card** | `/components/ui/Card.tsx` | padding, shadow, hover | Container component with sections |
| **Input** | `/components/ui/Input.tsx` | label, error, helperText, leftIcon, rightIcon | Form input with validation |
| **Badge** | `/components/ui/Badge.tsx` | variant, size, rounded | Status indicator badge |
| **Modal** | `/components/ui/Modal.tsx` | isOpen, onClose, title, size | Dialog/modal component |

### Layout Components

| Component | Location | Features |
|-----------|----------|----------|
| **Navbar** | `/components/layout/Navbar.tsx` | Responsive, auth-aware, mobile menu |
| **Footer** | `/components/layout/Footer.tsx` | Links, social icons, newsletter signup |

## 🔐 Authentication Architecture

### Auth Flow
1. **User Action** → Component triggers ViewModel method
2. **ViewModel** → Updates UI state, calls Manager
3. **Manager** → Orchestrates business logic, calls Service
4. **Service** → Makes Firebase/API calls
5. **Coordinator** → Handles navigation and side effects

### Auth State Management
- **Context**: `AuthContext` provides auth state globally
- **Hook**: `useAuth()` for accessing auth in components
- **Types**: Strongly typed with `auth.types.ts`

## 📝 Type System

### Core Types

```typescript
// User entity
interface User {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  metadata: UserMetadata
}

// Team entity
interface Team {
  id: string
  name: string
  sport: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'MLS'
  pointsBalance?: number
}

// Points transaction
interface PointsTransaction {
  id: string
  type: 'earned' | 'redeemed' | 'transferred' | 'expired'
  amount: number
  teamId: string
}

// Reward entity
interface Reward {
  id: string
  category: 'tickets' | 'merchandise' | 'experiences'
  pointsCost: number
  availability: 'available' | 'limited' | 'soldout'
}
```

## 🌐 API Structure

### RESTful Endpoints

```
/api/auth
  POST   /login         # User login
  POST   /signup        # User registration
  POST   /logout        # User logout
  POST   /refresh       # Refresh token

/api/users
  GET    /profile       # Get user profile
  PUT    /profile       # Update profile
  DELETE /account       # Delete account

/api/teams
  GET    /              # List all teams
  GET    /connected     # User's connected teams
  POST   /connect       # Connect new team
  DELETE /:id          # Disconnect team

/api/points
  GET    /balance       # Total points balance
  GET    /transactions  # Transaction history
  POST   /transfer      # Transfer points

/api/rewards
  GET    /              # Browse rewards
  GET    /:id          # Reward details
  POST   /redeem        # Redeem reward
```

## 🎯 Key Features Implementation

### 1. Points Dashboard
- **Location**: `/app/dashboard/page.tsx`
- **ViewModel**: `DashboardViewModel`
- **Features**:
  - Consolidated points display
  - Points breakdown by team
  - Recent transactions
  - Expiration alerts

### 2. Team Connections
- **Location**: `/app/teams/page.tsx`
- **Manager**: `TeamManager`
- **Features**:
  - OAuth integration with team apps
  - Real-time sync status
  - Connection management

### 3. Rewards Marketplace
- **Location**: `/app/rewards/page.tsx`
- **Service**: `RewardsService`
- **Features**:
  - Browse available rewards
  - Filter by team/category
  - Points redemption flow

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Team API Keys
LAKERS_API_KEY=
DODGERS_API_KEY=
RAMS_API_KEY=
CLIPPERS_API_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=

# Feature Flags
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true
NEXT_PUBLIC_ENABLE_POINTS_TRANSFER=false
```

### TypeScript Path Aliases

```json
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@/context/*": ["./src/context/*"],
  "@/viewmodels/*": ["./src/viewmodels/*"],
  "@/managers/*": ["./src/managers/*"],
  "@/coordinators/*": ["./src/coordinators/*"],
  "@/services/*": ["./src/services/*"],
  "@/types/*": ["./src/types/*"]
}
```

## 🧪 Testing Strategy

### Unit Tests
- Test utilities and pure functions
- Test ViewModels logic
- Test Managers business rules

### Integration Tests
- Test API endpoints
- Test service integrations
- Test auth flows

### E2E Tests
- Test critical user journeys
- Test points redemption flow
- Test team connection flow

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Score | > 90 | TBD |
| First Contentful Paint | < 1.5s | TBD |
| Time to Interactive | < 3.5s | TBD |
| Bundle Size | < 200KB | TBD |

## 🔒 Security Considerations

### Implementation Guidelines
- ✅ Validate all user inputs
- ✅ Use TypeScript for type safety
- ✅ Implement proper error boundaries
- ✅ Secure API endpoints with authentication
- ✅ Use environment variables for secrets
- ❌ Never log sensitive information
- ❌ Never commit secrets to repository

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement rate limiting
- Regular security audits
- GDPR/CCPA compliance

## 🚢 Deployment

### Recommended Platforms
1. **Vercel** (Recommended for Next.js)
2. **AWS Amplify**
3. **Netlify**
4. **Railway**

### Deployment Checklist
- [ ] Set environment variables
- [ ] Configure custom domain
- [ ] Setup SSL certificate
- [ ] Configure CDN
- [ ] Setup monitoring
- [ ] Configure error tracking
- [ ] Setup analytics

## 📈 Monitoring & Analytics

### Key Metrics to Track
- User acquisition and retention
- Points earned/redeemed ratio
- Team connection success rate
- Average points balance
- Redemption conversion rate
- Page load performance

## 🔄 Git Workflow

### Branch Strategy
```
main
├── develop
│   ├── feature/auth-system
│   ├── feature/points-dashboard
│   └── feature/team-integration
├── hotfix/critical-bug
└── release/v1.0.0
```

### Commit Convention
```
feat: Add points transfer feature
fix: Resolve login validation issue
docs: Update API documentation
style: Format code with prettier
refactor: Restructure auth logic
test: Add unit tests for utils
chore: Update dependencies
perf: Optimize image loading
```

## 📚 Additional Resources

### Internal Documentation
- [API Documentation](./docs/api.md)
- [Component Storybook](./docs/components.md)
- [Architecture Decision Records](./docs/adr/)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing Guidelines

### Code Standards
1. Use TypeScript strict mode
2. Follow ESLint rules
3. Write self-documenting code
4. Add JSDoc comments for complex logic
5. Keep components under 200 lines
6. One component per file
7. Colocate related code

### PR Requirements
- [ ] Passes type-check
- [ ] Passes lint
- [ ] Passes build
- [ ] Includes tests
- [ ] Updates documentation
- [ ] Follows commit convention

## 📞 Support & Contact

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our developer community
- **Email**: dev@pointrally.com
- **Documentation**: https://docs.pointrally.com

## 🎯 Roadmap

### Phase 1: Foundation (Current)
- ✅ Project structure setup
- ✅ Component library
- ✅ Authentication system
- ⏳ Dashboard implementation
- ⏳ Team connections

### Phase 2: Core Features
- [ ] Points synchronization
- [ ] Rewards marketplace
- [ ] Transaction history
- [ ] User profiles

### Phase 3: Enhancement
- [ ] Mobile apps (React Native)
- [ ] Real-time notifications
- [ ] Social features
- [ ] Analytics dashboard

### Phase 4: Scale
- [ ] Multi-language support
- [ ] International teams
- [ ] Blockchain integration
- [ ] AI recommendations

---

## 🚨 Important Notes for AI Assistants

### When Working on This Project:

1. **Architecture First**: Always respect the established architecture patterns
2. **Type Safety**: Ensure all code is properly typed
3. **Error Handling**: Implement comprehensive error handling
4. **Performance**: Consider performance implications
5. **Security**: Never expose sensitive data
6. **Testing**: Write tests for new features
7. **Documentation**: Update docs with changes

### Common Tasks:

```bash
# Before starting work
git pull origin main
npm install

# During development
npm run dev          # Start dev server
npm run type-check   # Check types
npm run lint         # Check code quality

# Before committing
npm run build        # Ensure builds work
git add .
git commit -m "feat: your feature"
git push origin feature/branch-name
```

### Quick Component Creation:

```typescript
// New UI Component Template
import React from 'react';

interface ComponentProps {
  // Define props
}

const ComponentName: React.FC<ComponentProps> = ({ ...props }) => {
  return <div>Component</div>;
};

export default ComponentName;
```

### Quick ViewModel Creation:

```typescript
// New ViewModel Template
import { useState } from 'react';

export class ComponentViewModel {
  // Define methods
}

export const useComponentViewModel = () => {
  // Define hooks and state
  return {
    // Return state and methods
  };
};
```

---

*Last Updated: December 2024*
*Version: 1.0.0*
*Maintained by: PointRally Development Team*