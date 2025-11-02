# Nepal Jyotish - नेपाल ज्योतिष

Traditional Nepali kundali Maker & Kundali Platform based on Vedic Jyotish and Surya Siddhanta.

## 🌟 Overview

Nepal Jyotish is a free, comprehensive online platform for creating traditional Nepali birth charts (kundali/चाइना) and Kundali. Built with modern web technologies while honoring ancient Vedic astrological principles from Surya Siddhanta.

### Key Features

- **Traditional kundali Maker** (परम्परागत चाइना) - Create authentic Nepali birth charts
- **Complete Kundali** - Full birth chart with all divisional charts (D1-D60)
- **Planetary Positions** - Real-time graha sthiti based on Surya Siddhanta
- **Dasha Systems** - Vimshottari, Yogini, and Tribhagi Dasha calculations
- **Educational Content** - Blog articles about Jyotish in Nepali
- **100% Free** - No subscriptions, no paywalls

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Calculations**: @mhnpd-org/panchang
- **Fonts**: Google Fonts (Mukta, Noto Serif Devanagari)
- **Build Tool**: Turbopack

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔍 SEO Optimization

This project is fully optimized for search engines with comprehensive SEO best practices:

### Target Keywords

- Nepali Jyotish, Nepal Jyotish
- kundali, Traditional, Kundali
- Nepali kundali Maker
- Vedic Jyotish, Surya Siddhanta
- Hamro Jyotish, Mero Jyotish
- And 70+ more targeted keywords

### SEO Features

✅ Comprehensive metadata with bilingual support (Nepali + English)  
✅ JSON-LD structured data (Organization, WebSite, SoftwareApplication, BreadcrumbList)  
✅ XML Sitemap with all routes  
✅ Optimized robots.txt  
✅ Open Graph and Twitter Card tags  
✅ Semantic HTML with proper heading hierarchy  
✅ Mobile-optimized with proper viewport settings  
✅ Canonical URLs for all pages

### SEO Configuration

All SEO settings are centralized in `src/lib/seo-config.ts` for easy management. See [SEO-IMPLEMENTATION.md](./SEO-IMPLEMENTATION.md) for complete documentation.

## 📁 Project Structure

```
nep-astro/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── astro/             # Jyotish tools
│   │   │   ├── janma/         # Birth chart input
│   │   │   ├── traditional/   # Traditional kundali view
│   │   │   ├── charts/        # Varga charts (D1-D60)
│   │   │   ├── planet-position/ # Planetary positions
│   │   │   ├── vimshottari-dasha/
│   │   │   ├── yogini-dasha/
│   │   │   └── tribhagi-dasha/
│   │   ├── blogs/             # Educational content
│   │   ├── layout.tsx         # Root layout with SEO
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components
│   ├── form-elements/         # Form inputs (date, time, location)
│   ├── lib/                   # Utility functions
│   │   ├── seo-config.ts     # SEO configuration
│   │   ├── blogs.ts          # Blog utilities
│   │   └── devanagari.ts     # Nepali text helpers
│   └── blogs/                 # MDX blog content
├── public/                    # Static assets
├── scripts/                   # Build scripts
│   └── generate-sitemap.js   # Sitemap generator
└── out/                       # Static export output
```

## 🎨 Design System

### Color Palette

- **Primary Gradient**: Amber to Rose (Vedanga-inspired)
  - `from-amber-900` to `via-rose-700` to `to-orange-600`
- **Background**: Off-white with gradient overlay
- **Text**: Devanagari-optimized fonts

### Typography

- **Body**: Mukta (Devanagari + Latin)
- **Headings**: Noto Serif Devanagari
- **Code**: Geist Mono

## 🌐 Deployment

The site is configured for static export and can be deployed to:

- Vercel (recommended)
- Cloudflare Pages
- Netlify
- GitHub Pages
- Any static hosting

```bash
npm run build    # Generates static files in /out
```

## 📊 Analytics Setup (To Do)

1. Add Google Search Console verification code
2. Set up Google Analytics 4
3. Add Bing Webmaster Tools verification
4. Configure social media properties

See [SEO-IMPLEMENTATION.md](./SEO-IMPLEMENTATION.md) for detailed instructions.

## 📝 Content Strategy

### Blog Topics

- Nepal ma kundali kaise banaye
- Vimshottari Dasha calculation methods
- Nakshatra analysis
- Planetary position effects
- Surya Siddhanta introduction
- Traditional vs Modern Jyotish

## 🤝 Contributing

This is a community project aimed at preserving and promoting traditional Nepali Jyotish. Contributions are welcome!

## 📄 License

[Add your license here]

## 🔗 Links

- Website: https://nepaljyotish.org
- Alternative names: Hamro Jyotish, Mero Jyotish

## 🙏 Acknowledgments

- Based on Vedic Jyotish principles
- Calculations from Surya Siddhanta
- Built for the Nepali community worldwide

---

**नेपाली ज्योतिष - परम्परागत चाइना मेकर**  
Traditional Nepali kundali Maker & Kundali for Everyone
