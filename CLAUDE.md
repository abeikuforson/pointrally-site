# CLAUDE.md - AI Assistant Documentation for PointRally

## Project Overview

**PointRally** is a sports loyalty points aggregator platform that consolidates loyalty points from multiple sports teams into one unified balance, allowing fans to use their points across different teams and events.

### Core Concept
- **Problem**: Sports fans have multiple team apps (Lakers, Dodgers, Rams, etc.) each with separate loyalty points that often expire unused
- **Solution**: PointRally combines all team loyalty points into one balance for cross-team usage
- **Target**: Sports enthusiasts who follow multiple teams across different leagues

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm

## Project Structure

```
pointrally-site/
├── src/
│   ├── app/              # App Router pages and layouts
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   └── components/       # Reusable React components
├── public/              # Static assets
├── .github/             # GitHub templates and workflows
├── package.json         # Dependencies and scripts
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── .eslintrc.json       # ESLint configuration
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Key Features to Implement

1. **User Authentication**
   - Sign up/Login system
   - OAuth integration with team apps
   - Secure token management

2. **Points Dashboard**
   - View consolidated points balance
   - Points breakdown by team
   - Transaction history

3. **Team Integrations**
   - Connect multiple team loyalty accounts
   - Real-time points synchronization
   - API integrations with major sports teams

4. **Redemption System**
   - Browse available rewards across teams
   - Points conversion calculator
   - Redemption processing

5. **Analytics**
   - Points usage tracking
   - Earning patterns
   - Expiration alerts

## API Structure (Planned)

```
/api/auth           # Authentication endpoints
/api/users          # User management
/api/teams          # Team connections
/api/points         # Points management
/api/rewards        # Reward catalog
/api/transactions   # Transaction history
```

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Team API Keys (examples)
LAKERS_API_KEY=
DODGERS_API_KEY=
RAMS_API_KEY=
```

## Deployment

The project is configured for easy deployment to:
- Vercel (recommended for Next.js)
- AWS Amplify
- Netlify
- Docker containers

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push branch: `git push origin feature/your-feature`
4. Create pull request to `main`

## Commit Convention

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Maintenance

## Testing Strategy

- Unit tests for utility functions
- Component testing with React Testing Library
- E2E testing with Playwright/Cypress
- API endpoint testing

## Security Considerations

- Implement proper authentication/authorization
- Secure API endpoints
- Validate all user inputs
- Use HTTPS in production
- Regular dependency updates
- Environment variable protection

## Performance Goals

- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Core Web Vitals optimization

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Color contrast ratios

## Future Enhancements

1. Mobile applications (iOS/Android)
2. Real-time notifications
3. Social features (leagues, challenges)
4. Points marketplace
5. Predictive analytics
6. Blockchain integration for points verification

## Support & Resources

- GitHub Issues: Report bugs and request features
- Documentation: Comprehensive API and user guides
- Community: Discord/Slack channels
- Email: support@pointrally.com

---

*This document should be updated as the project evolves to maintain accurate AI assistant context.*