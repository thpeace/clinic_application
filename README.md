# Clinic Application

A modern clinic management system built with **React 19**, **TypeScript**, and **Tailwind CSS**. This application provides a comprehensive dashboard for managing clinic operations, user profiles, appointments, and more.

![Dashboard Preview](./banner.png)

## ✨ Features

- **Dashboard** - Overview of clinic metrics and key statistics
- **User Management** - Profile management and user forms
- **Calendar** - Appointment scheduling with drag-and-drop support
- **Data Visualization** - Line and bar charts using ApexCharts
- **Authentication** - Sign in and sign up pages
- **UI Components** - Alerts, badges, buttons, avatars, and more
- **Dark Mode** - Built-in dark mode support 🌙

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Vite | Build tool |
| React Router v7 | Navigation |
| ApexCharts | Data visualization |
| FullCalendar | Calendar functionality |

## 📋 Prerequisites

- **Node.js** 18.x or later (recommended: Node.js 20.x+)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd clinic_application
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

   > **Note:** Use `--legacy-peer-deps` flag if you encounter peer dependency issues.

3. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UserProfile/     # User profile components
│   ├── auth/            # Authentication components
│   ├── charts/          # Chart components
│   ├── common/          # Common utilities
│   ├── form/            # Form components
│   ├── header/          # Header components
│   ├── tables/          # Table components
│   └── ui/              # UI elements
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── icons/               # SVG icons
├── layout/              # Layout components
└── pages/               # Page components
    ├── AuthPages/       # Sign in/Sign up pages
    ├── Charts/          # Chart pages
    ├── Dashboard/       # Dashboard pages
    ├── Forms/           # Form pages
    ├── Tables/          # Table pages
    └── UiElements/      # UI element pages
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🐳 Docker

The project includes Docker support for containerized deployment:

```bash
# Development
docker build -f Dockerfile -t clinic-app .

# Production
docker build -f Dockerfile.production -t clinic-app-prod .
```

## 🔗 Routes

| Path | Description |
|------|-------------|
| `/` | Home Dashboard |
| `/profile` | User Profile |
| `/calendar` | Calendar/Appointments |
| `/form-user` | User Form |
| `/form-elements` | Form Elements |
| `/basic-tables` | Data Tables |
| `/signin` | Sign In Page |
| `/signup` | Sign Up Page |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Built on [TailAdmin React](https://tailadmin.com) template
- Icons from the TailAdmin icon set
- UI components styled with Tailwind CSS
