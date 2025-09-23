# PointRally - Sports Loyalty Points Aggregator

<div align="center">
  <p><strong>One Balance. All Teams. Maximum Rewards.</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🏆 What is PointRally?

PointRally revolutionizes how sports fans manage their loyalty points. Instead of juggling multiple team apps with separate point balances that often expire unused, PointRally consolidates all your sports loyalty points into one unified platform.

### The Problem We Solve

- **Fragmented Loyalty Programs**: Lakers app, Dodgers app, Rams app - each with isolated points
- **Wasted Rewards**: Points expire before fans can accumulate enough for meaningful rewards
- **Limited Redemption Options**: Stuck using points only within each team's ecosystem
- **Complex Management**: Tracking multiple accounts, passwords, and point balances

### Our Solution

PointRally creates a unified loyalty ecosystem where:
- ✅ All your team points live in one place
- ✅ Points can be combined across teams for bigger rewards
- ✅ Never lose track of expiring points
- ✅ Access exclusive cross-team experiences

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abeikuforson/pointrally-site.git
   cd pointrally-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
pointrally-site/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # User dashboard
│   │   ├── teams/        # Team connections
│   │   └── rewards/      # Rewards marketplace
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components
│   │   └── features/    # Feature-specific components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript definitions
├── public/              # Static assets
├── tests/               # Test files
└── docs/               # Documentation
```

## ✨ Features

### Current Features
- 🔐 **Secure Authentication** - Multi-factor authentication and OAuth integration
- 📊 **Unified Dashboard** - View all your points in one place
- 🔄 **Real-time Sync** - Automatic synchronization with team apps
- 📱 **Responsive Design** - Seamless experience across all devices

### Roadmap
- [ ] Mobile apps (iOS & Android)
- [ ] Points marketplace
- [ ] Social features & leagues
- [ ] Predictive analytics
- [ ] Blockchain verification
- [ ] Virtual season tickets
- [ ] Cross-team bundles

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand / Context API
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma
- **Deployment**: Vercel / AWS
- **Testing**: Jest, React Testing Library, Playwright

## 📝 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
```

### Code Standards

We follow strict code quality standards:
- TypeScript for type safety
- ESLint for code consistency
- Prettier for formatting
- Conventional commits
- 90%+ test coverage goal

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

Security is our top priority. Please review our [Security Policy](SECURITY.md) for reporting vulnerabilities.

## 📞 Support

- 📧 Email: support@pointrally.com
- 💬 Discord: [Join our community](https://discord.gg/pointrally)
- 🐛 Issues: [GitHub Issues](https://github.com/abeikuforson/pointrally-site/issues)
- 📖 Docs: [Documentation](https://docs.pointrally.com)

## 🙏 Acknowledgments

- All the sports fans who inspired this project
- Our partner teams and organizations
- The open-source community

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=abeikuforson/pointrally-site&type=Date)](https://star-history.com/#abeikuforson/pointrally-site&Date)

---

<div align="center">
  Made with ❤️ by the PointRally Team
  <br />
  <a href="https://pointrally.com">pointrally.com</a>
</div>
