# CarryBee Express Ltd. - IT Asset Send / Received Form Generator

A dynamic, web-based management and generation system for **CarryBee Express Ltd.** IT Asset Send / Received Forms with pixel-perfect A4 printing, dynamic table & column generation, multi-device and laptop requisition sub-tables, and instant export/import.

![CarryBee Form Preview](https://img.shields.io/badge/CarryBee-IT%20Asset%20Form-amber.svg)
![React 19](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)
![Vite](https://img.shields.io/badge/Vite-Fast-purple.svg)

---

## 🌟 Features

- **4 Pre-loaded Authentic Templates**:
  - **Sample 1 (Image 1)**: Standard 15-item IT Asset Send / Received form (Printers, Laptops, Scanners, CPU with exact Hub Incharge, Remarks, and Mail memo).
  - **Sample 2 (Image 2)**: Requisition sections with custom tables — **Laptop Bag** (Blue table) & **Mobile Scanner POS** (Green table).
  - **Sample 3 (Image 3)**: Mixed multi-department laptop requisitions with Yellow sub-tables and P.T.O support.
  - **Sample 4 (Image 4)**: Official Blank Form with 15 empty rows for immediate printing or blank distribution.
- **Dynamic Field & Table Builder**:
  - Add, remove, and rename custom columns (e.g., Serial No, Condition, Warranty, Cost).
  - Add dynamic sub-tables with custom color themes (Yellow, Green, Blue, Slate, White).
  - Add single rows or bulk `+5 Rows`.
  - Auto-renumber SL (1 to N).
  - Duplicate, reorder (move up/down), or delete rows.
  - Quick-pick hub names (Mohakhali, Central Sort, CTG-Patiya, Narail, Dinajpur, etc.) and asset names.
- **Dual Editing Modes**:
  - **Structured Editor Panel**: Form controls for header, from/to parties, columns, and rows.
  - **Inline Click-to-Edit**: Click directly on any document text in the preview to edit in real time!
- **Pixel-Perfect A4 Vector Print & PDF**:
  - One-click **Print / PDF** button prints genuine A4 vector pages with zero watermark or blur.
- **Export & Import**:
  - Save as JSON / Open previously saved forms.
  - One-click **Copy for Excel / Google Sheets** (TSV formatted).
  - Local auto-save in browser (`localStorage`).

---

## 🚀 How to Run Locally

```bash
# 1. Clone your repository
git clone https://github.com/YOUR_USERNAME/carrybee-asset-form.git
cd carrybee-asset-form

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

App will run at `http://localhost:3000` or `http://localhost:5173`.

---

## 🌐 Deploy to Web (GitHub Pages / Vercel)

### Option A: Free 1-Click Deployment with Vercel
1. Push this code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CarryBee IT Asset Form Generator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/carrybee-asset-form.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New Project"** and select your `carrybee-asset-form` repository.
4. Click **Deploy**. Your web-based live app will be ready in under 1 minute!

### Option B: GitHub Pages
1. In `vite.config.ts`, add `base: '/carrybee-asset-form/'` (replace with your repo name).
2. Run `npm run build`.
3. Deploy the `dist` folder to GitHub Pages via repository settings.
