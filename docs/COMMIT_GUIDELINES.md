# 📝 Commit Guidelines

This document outlines the commit message conventions and guidelines for the Campus Helper Platform project.

## 🎯 Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages. This ensures consistency, readability, and enables automated tooling.

### Format Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Components

1. **Type** (required): The type of change being made
2. **Scope** (optional): The area of the codebase affected
3. **Subject** (required): A brief description of the change
4. **Body** (optional): Detailed explanation of the change
5. **Footer** (optional): Reference to issues, breaking changes, etc.

---

## 📋 Commit Types

### Core Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | A new feature | `feat(requests): add file upload support` |
| `fix` | A bug fix | `fix(dashboard): resolve status update issue` |
| `docs` | Documentation changes | `docs(readme): update installation steps` |
| `style` | Code style changes (formatting, missing semicolons, etc.) | `style(components): format code with prettier` |
| `refactor` | Code refactoring without changing functionality | `refactor(api): improve error handling` |
| `perf` | Performance improvements | `perf(map): optimize marker rendering` |
| `test` | Adding or updating tests | `test(requests): add unit tests for service` |
| `chore` | Maintenance tasks, dependency updates | `chore(deps): update react to v19` |
| `build` | Build system or dependency changes | `build(vite): update vite configuration` |
| `ci` | CI/CD pipeline changes | `ci(github): add automated testing workflow` |

### Additional Types

| Type | Description | Example |
|------|-------------|---------|
| `revert` | Revert a previous commit | `revert: revert "feat(chat): add typing indicators"` |
| `config` | Configuration file changes | `config(env): update API endpoint URLs` |

---

## 🎨 Scope Examples

Scopes should be lowercase and represent the area of the codebase:

### Frontend Scopes
- `frontend` - General frontend changes
- `components` - React components
- `pages` - Page components
- `hooks` - Custom React hooks
- `services` - API and service files
- `types` - TypeScript type definitions
- `utils` - Utility functions
- `styles` - CSS/styling changes
- `layout` - Layout components
- `chatbot` - AI chatbot feature
- `map` - Campus map feature
- `dashboard` - Admin dashboard
- `requests` - Service requests feature
- `chat` - Real-time chat feature
- `analytics` - Analytics dashboard

### Backend Scopes
- `backend` - General backend changes
- `api` - API routes
- `controllers` - Controller files
- `models` - Database models
- `middleware` - Middleware functions
- `services` - Service layer
- `socket` - Socket.io implementation
- `database` - Database related changes
- `auth` - Authentication

### General Scopes
- `docs` - Documentation
- `config` - Configuration files
- `deps` - Dependencies
- `ci` - Continuous Integration
- `build` - Build configuration

---
