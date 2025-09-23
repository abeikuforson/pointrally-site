# Contributing to PointRally

First off, thank you for considering contributing to PointRally! It's people like you that make PointRally such a great tool for sports fans everywhere.

## 🤝 Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and expected**
- **Include screenshots if possible**
- **Include your environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Provide specific use cases**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows our style guidelines
5. Issue that pull request!

## 🚀 Development Process

### Prerequisites

- Node.js 18.17+
- npm or yarn
- Git

### Setting Up Development Environment

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pointrally-site.git
   cd pointrally-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a branch for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding or updating tests
- `chore:` Changes to build process or auxiliary tools

Examples:
```
feat: add points conversion calculator
fix: resolve authentication token expiration issue
docs: update API documentation
```

## 📋 Pull Request Process

1. **Update Documentation**: Update the README.md with details of changes if applicable
2. **Update CHANGELOG**: Add your changes to the CHANGELOG.md under "Unreleased"
3. **Pass All Tests**: Ensure all tests pass and coverage remains high
4. **Request Review**: Request review from maintainers
5. **Address Feedback**: Make requested changes promptly
6. **Squash Commits**: Keep git history clean by squashing commits if requested

## 🏗️ Project Structure Guidelines

### File Organization

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable components
│   ├── ui/       # Basic UI components
│   └── features/ # Feature-specific components
├── lib/          # Utility functions
├── hooks/        # Custom React hooks
├── services/     # API and external services
├── types/        # TypeScript type definitions
└── styles/       # Global styles
```

### Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract business logic into custom hooks
- Use TypeScript for all components
- Write unit tests for components

### State Management

- Use React Context for global state
- Consider Zustand for complex state management
- Keep state as local as possible
- Avoid prop drilling

## 🔍 Review Process

All submissions require review. We use GitHub pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information.

### Review Criteria

- Code quality and style consistency
- Test coverage
- Documentation updates
- Performance impact
- Security considerations
- Accessibility compliance

## 🎁 Recognition

Contributors will be recognized in our:
- README.md contributors section
- Release notes
- Project website

## 💬 Communication

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and discussions
- **Discord**: For real-time chat (link in README)
- **Email**: dev@pointrally.com for sensitive matters

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ❓ Questions?

Don't hesitate to ask questions! We're here to help. You can:
- Open an issue with the "question" label
- Start a discussion in GitHub Discussions
- Reach out on our Discord server

Thank you for contributing to PointRally! 🎉