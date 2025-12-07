# 🎓 Campus Helper Platform

A comprehensive web-based solution designed to centralize campus services, requests, and information for university students.

## 📋 Overview

The Campus Helper Platform streamlines communication between students and administration, providing an efficient system for managing campus-related issues, tracking service requests, and accessing essential campus resources.

## ✨ Features

- 🎫 **Service Request System** - Submit and track campus service requests
- 📊 **Admin Dashboard** - Manage and monitor all service requests
- 🗺️ **Campus Map** - Interactive map with key campus locations
- 📢 **Announcements Board** - Stay updated with campus news and notices
- 💬 **Real-time Chat** - Communicate with administrators about requests
- 📈 **Analytics Dashboard** - View request statistics and trends
- 🤖 **AI Campus Assistant** - Get instant answers to campus questions
- 🔔 **Real-time Notifications** - Stay informed about request updates

## 🛠️ Technology Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Socket.io Client
- React Leaflet
- Recharts

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Socket.io
- OpenAI API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm/yarn/pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fccu-web-competition.git
   cd fccu-web-competition
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   cd codes/frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Frontend - codes/frontend/.env
   VITE_API_URL=http://localhost:3000
   VITE_SOCKET_URL=http://localhost:3000
   
   # Backend - codes/backend/.env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/campus-helper
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run development servers:**
   ```bash
   # Frontend (Terminal 1)
   cd codes/frontend
   npm run dev
   
   # Backend (Terminal 2)
   cd codes/backend
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
fccu-web-competition/
├── codes/
│   ├── frontend/          # React frontend application
│   └── backend/           # Node.js backend API
├── docs/                  # Project documentation
├── COMMIT_GUIDELINES.md   # Commit message guidelines
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # This file
```

## 📚 Documentation

- [Frontend Setup Guide](codes/frontend/README.md)
- [Commit Guidelines](COMMIT_GUIDELINES.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Quick Commit Reference](COMMIT_QUICK_REFERENCE.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Commit Guidelines](COMMIT_GUIDELINES.md) before submitting pull requests.

### Quick Commit Guide

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <subject>

# Examples:
feat(requests): add file upload functionality
fix(dashboard): resolve status update issue
docs(readme): update installation steps
```

See [COMMIT_QUICK_REFERENCE.md](COMMIT_QUICK_REFERENCE.md) for a quick cheat sheet.

## 📝 Commit Message Setup

To use the commit message template:

```bash
git config commit.template .gitmessage
```

## 🧪 Development

### Frontend
```bash
cd codes/frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

### Backend
```bash
cd codes/backend
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
npm test         # Run tests
```

## 📄 License

MIT

## 👥 Contributors

Thank you to all contributors who help improve this project!

---

For detailed documentation, see the [docs](docs/) folder.

