# Ayush Kamble Portfolio

A modern, responsive personal portfolio web application for Ayush Kamble, built from the Figma export and converted into a production-ready Vite + React app.

## Features

- Sticky responsive navigation with active section highlighting
- Dark and light theme toggle with local storage
- Hero typing animation and stable animated background particles
- About, skills, projects, resume, contact, and footer sections
- Animated skill progress indicators
- Featured project cards with local visual assets
- Contact form validation and success state
- Back-to-top button and scroll reveal animations
- SEO-friendly metadata and GitHub Pages-ready build

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons

## Project Structure

```text
portfolio-website/
  public/
    assets/
      profile.jpg
      resume.pdf
      swaad-margdarshak.png
      lakshya.png
      manzil.png
  src/
    app/
      App.tsx
    styles/
      index.css
      theme.css
      tailwind.css
      fonts.css
  index.html
  package.json
  vite.config.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Customize

Update profile/contact links in `src/app/App.tsx` inside the `PROFILE` object.

Replace generated placeholder assets in `public/assets/` with your real profile photo, resume PDF, and project screenshots when available.

## GitHub Pages Deployment

1. Create a GitHub repository and push this `portfolio-website/` folder to it.
2. In the repo settings, enable GitHub Pages from the `main` branch and the root folder.
3. If you want to publish the Vite build instead, use a GitHub Actions or `gh-pages` workflow to deploy `dist/`.
4. `vite.config.ts` is already set to `base: "./"`, so the site also works from a repository subpath.
5. After Pages is enabled, put the GitHub Pages URL in your GitHub profile or repository README so visitors can open the live portfolio directly.
