# 🗳️ CUP Voting System

A modern, colorful web application for managing electoral counting for the Pastoral Unit Council (Consiglio di Unità Pastorale - CUP).

![Status](https://img.shields.io/badge/status-draft-yellow)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.18-38B2AC)

> ⚠️ **First Draft - Vibe-Coded**
> This project is a first draft proof-of-concept, rapidly developed using AI-assisted coding. While fully functional, it may benefit from code review, refactoring, and additional testing before production use.

## 📋 Overview

The CUP Voting System is a single-page application designed to streamline the vote counting process for parish elections. It manages candidates across different age groups and parishes, validates ballots according to custom rules, and provides real-time results visualization.

### Key Features

- **🎨 Colorful Modern UI** - Vibrant gradient-based design with smooth animations and responsive layout
- **👥 Candidate Management** - Add, organize, and delete candidates by parish and age group
- **🗳️ Ballot Registration** - Real-time validation with visual feedback for valid/invalid/blank ballots
- **📊 Results Tracking** - Live vote counting with percentage calculations and progress bars
- **💾 Auto-Save** - Automatic data persistence using browser localStorage
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **📥 CSV Export** - Download complete results and ballot summary

## 🏛️ Voting Rules

The system enforces specific voting rules based on parish:
- **Santo Stefano**: Maximum 3 votes per age group
- **San Pio X**: Maximum 2 votes per age group
- **Immacolata ai Passi**: Maximum 1 vote per age group

Age groups: 18-35, 36-60, 61+

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cup-voting-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: TailwindCSS 3.4.18
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Browser localStorage

## 📱 Application Structure

### Three Main Sections

1. **📋 Candidate Management** (`Gestione Candidati`)
   - Add new candidates with name, parish, and age group
   - View candidates organized by parish and age group
   - Delete candidates with confirmation
   - Visual counters for each category

2. **🗳️ Ballot Registration** (`Registrazione Schede`)
   - Select candidates for current ballot
   - Real-time vote counter per category
   - Visual validation (green=valid, red=invalid, gray=blank)
   - Register valid, invalid, or blank ballots
   - Undo last ballot feature
   - Summary cards showing ballot counts

3. **📊 Results** (`Risultati`)
   - Live vote totals per candidate
   - Percentage calculations and progress bars
   - Organized by parish and age group
   - Summary statistics (total, valid, invalid, blank ballots)
   - CSV export functionality
   - Reset all data option

## 💾 Data Persistence

All data is automatically saved to browser localStorage:
- Candidates list (`cup-candidati`)
- Ballot records (`cup-schede`)
- Vote results (`cup-risultati`)

Data persists across page refreshes and browser sessions until explicitly cleared using the "Reset Tutto" button.

## 🎨 Design Features

- **Gradient Backgrounds**: Colorful blue → purple → pink gradients
- **Smooth Animations**: Scale transforms and shadow effects on hover
- **Responsive Layout**: Adapts seamlessly from mobile (320px) to desktop
- **Visual Feedback**: Color-coded validation states and interactive elements
- **Accessibility**: Clear typography and high-contrast color schemes

## 🔮 Future Enhancements

Potential improvements for future versions:
- [ ] Multi-language support (Italian/English)
- [ ] Print-friendly results page
- [ ] Advanced filtering and search
- [ ] User authentication for secure access
- [ ] Cloud backup/sync functionality
- [ ] PDF export in addition to CSV
- [ ] Dark mode support
- [ ] Audit trail for all actions
- [ ] TypeScript migration for type safety

## 📝 License

This project is currently unlicensed. Please contact the repository owner for usage permissions.

## 🤝 Contributing

As this is a first draft project, contributions are welcome! Please feel free to:
- Report bugs via issues
- Suggest improvements
- Submit pull requests for review

## ⚠️ Disclaimer

This application is designed for internal use in electoral counting for pastoral councils. It does not implement cryptographic security measures or formal audit trails required for official government elections. Use in appropriate contexts only.

---

**Built with ❤️ using AI-assisted development**
