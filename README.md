# LayoutForge 🎨⚡

> Modern, AI-augmented visual layout builder and design system studio for web applications.

![LayoutForge Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80)

LayoutForge is an advanced visual page builder, canvas editor, and responsive layout engine designed to rapidly assemble modern web pages, explore curated design vibes inspired by Google Stitch, and export production-ready HTML/CSS and React 18 + TypeScript + Material UI codebases.

---

## ✨ Features

- 🖥️ **Interactive Visual Canvas**
  - Drag-and-drop elements with pixel-accurate alignment guides.
  - Multi-element selection and group movement (`Shift + Click` or drag selection).
  - Fine-grained controls for dimensions, typography, borders, shadows, animations, and hover micro-interactions.

- 📱 **Intelligent Automatic Responsiveness**
  - Instant viewport switching: **Desktop** (1440px), **Tablet** (768px), and **Mobile** (375px).
  - Dynamic responsive geometry: multi-column cards stack automatically on mobile and organize into 2-column grids on tablet.
  - Fluid typography clamp scaling and container-aware navbar & footer adaptation (mobile hamburger menu & wrapped footer).
  - Dynamic artboard height expansion to comfortably fit stacked content.
  - Device-specific overrides preserved per viewport mode.

- 🧵 **Stitch Design System & Vibe Engine**
  - 14 curated design vibes (Minimalism, Neo-Brutalism, Cyberpunk, Glass Effect, Cosmic Gradient, Bauhaus, Editorial, Claymorphism, and more).
  - Automatic artboard background color, typography, surface translucency (`backdropFilter: blur(16px)`), and palette synchronization.
  - **Upload `design.md`**: Drag and drop custom Markdown design token files to automatically extract and apply colors, fonts, and radii to your canvas.

- 🧩 **19+ Component Catalog**
  - Navigation bars with custom brand titles, logo upload/URL, search bar, links, avatar, and dedicated title text color picker.
  - Footers with responsive column wrapping and copyright controls.
  - Cards, Hero containers, Badges, Lists (check, bullet, numbered), Headings (H1-H4), Paragraphs, Form inputs, Select dropdowns, Checkboxes, Radio groups, Images, Videos, and Icons.

- 🚀 **Full-Stack Code Export**
  - **Clean Semantic HTML5 + Vanilla CSS**: Single-file bundle ready to open in any browser.
  - **Production React 18 + TypeScript + Material UI (MUI v5)**: Complete project bundle with `App.tsx`, `theme.ts`, `package.json`, and Vite setup.
  - **ZIP Bundle Export**: One-click download of the complete codebase including images and style assets.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript & Modern ES6+ JavaScript
- **Styling**: Tailwind CSS & Material UI (MUI v5)
- **State Management**: Zustand with history (Undo / Redo)
- **Icons**: Lucide Icons & MUI Icons
- **Packaging & Bundling**: JSZip, FileSaver, Vite
- **Testing**: Vitest (55+ unit & integration tests)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jaygnws-dotcom/LayoutForge.git

# Navigate into project directory
cd LayoutForge

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start designing.

### Running Tests

```bash
# Run unit & responsive tests
npm test
```

### Building for Production

```bash
# Compile TypeScript & build bundle
npm run build
```

---

## 📄 License

MIT License © 2026 LayoutForge.
