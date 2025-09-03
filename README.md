# Shang Properties

A modern real estate web application focused on showcasing premier Shang properties in the Philippines. Built with React, TypeScript, Vite, and Tailwind CSS, this platform provides expert advice, property listings, and real estate guidance for discerning clients and property seekers.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Showcase](#project-showcase)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Vercel Blob Setup](#vercel-blob-setup)
- [Asset Management](#asset-management)
- [Version Management](#version-management)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Shang Properties** is a comprehensive real estate platform designed to present the finest Shang developments in Metro Manila. The application features detailed project pages, immersive galleries, 360° virtual tours, and a robust admin dashboard for property management and client inquiries.

---

## Features
- ✨ Elegant, responsive UI with Tailwind CSS
- 🏢 Detailed project pages for each Shang property
- 🖼️ Image galleries and 360° virtual tours
- 🔒 Secure admin dashboard (login required)
- 📋 Project, inquiry, and page management for admins
- 📧 Contact and inquiry forms for clients
- 🔥 Built with React, TypeScript, and Vite for fast performance
- ☁️ Firebase authentication and backend integration
- 📦 Vercel Blob storage for media assets
- 📤 Asset uploader for easy file management

---

## Project Showcase

### Featured Properties

- **Laya Residences**  
  Ortigas Center, Pasig City  
  _"Luxury living in Ortigas Center. 1,283 units, 2,934 sqm of amenities."_

- **Shang Summit Residences**  
  South Triangle, Quezon City  
  _"Privacy & Convenience at Heart. 1,020 units in the East Tower."_

- **Haraya Residences**  
  Bridgetowne Estate, Pasig City  
  _"Serene views and elegant lifestyle. 558 homes in the South Tower."_

- **Aurelia Residences**  
  Bonifacio Global City, Taguig  
  _"A limited collection of 285 bespoke residences with cosmopolitan views."_

- **Shang Residences at Wack Wack**  
  Mandaluyong City  
  _"Exclusive resort-inspired living beside Wack Wack Golf & Country Club."_

---

## Screenshots

> _Add screenshots or GIFs of the homepage, project pages, admin dashboard, and 360° tours here._

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Firebase, Node.js (for API/inquiries)
- **Authentication:** Firebase Auth (Google sign-in)
- **UI Libraries:** Framer Motion, React Icons, Swiper
- **Storage:** Vercel Blob
- **Other:** ESLint, Prettier, Axios

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ShangProperties.git
cd ShangProperties

# Install dependencies
npm install
```

### Vercel Blob Setup

This project uses Vercel Blob for storing media assets. To set it up:

1. Create a Vercel account and project if you haven't already
2. Go to your project's dashboard and navigate to the Storage tab
3. Create a new Blob store
4. Generate a read/write token for the store
5. Copy the token and add it to your `.env.local` file:

```env
VITE_BLOB_READ_WRITE_TOKEN=your_token_here
```

6. Restart your development server to load the new environment variables

If you don't have a `.env.local` file, create one in the project root with the above content.

## Asset Management

Assets can be uploaded to Vercel Blob storage using the command line:

```bash
npm run upload:assets
```

Each component that needs to upload assets (like Projects, HeroEditor, etc.) has its own upload functionality built-in.

### Running the App

```bash
# Start the development server
npm run dev

# For fullstack (frontend + backend, if backend exists)
npm run dev:all
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Version Management

This project uses automated version management with semantic versioning. Instead of manually updating the version in [package.json](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/package.json), use the built-in scripts:

- `npm run release` — Create a new release with automatic version bumping and push to GitHub
- `npm run release:patch` — Create a new patch release (0.0.1) and push to GitHub
- `npm run release:minor` — Create a new minor release (0.1.0) and push to GitHub
- `npm run release:major` — Create a new major release (1.0.0) and push to GitHub

These commands will automatically:
1. Increment the version in [package.json](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/package.json) and [package-lock.json](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/package-lock.json)
2. Generate/update [CHANGELOG.md](file:///C:/Users/user/OneDrive/Documents/GitHub/Repositories/ShangProperties/CHANGELOG.md) based on commit messages
3. Create a git commit with the version changes
4. Create a git tag for the new version
5. Automatically push all changes and tags to GitHub

See [VERSIONING.md](VERSIONING.md) and [VERSIONING_SUMMARY.md](VERSIONING_SUMMARY.md) for more detailed information.

---

## Available Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Build the app for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint for code quality
- `npm run upload:assets` — Upload assets from src/assets to Vercel Blob storage
- `npm run dev:all` — Run both frontend and backend (if backend exists)

---

## Folder Structure

```
ShangProperties/
├── src/
│   ├── components/         # Reusable UI components
│   ├── data/               # Project data and assets
│   ├── layouts/            # Layout components
│   ├── pages/              # Page components (admin & client)
│   ├── router/             # Routing configuration
│   └── ...
├── public/                 # Static assets
├── backend/                # Backend API (if present)
├── index.html              # Main HTML file
├── package.json            # Project metadata and scripts
└── README.md               # Project documentation
```

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> _Expert real estate guide focused on Shang properties in the Philippines._