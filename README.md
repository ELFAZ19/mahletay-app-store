# Christian Orthodox Hymn Platform

A production-ready full-stack web platform for managing and distributing a Christian Orthodox Hymn mobile application. Built with sacred aesthetics, modern UI/UX, and comprehensive functionality.

## 🕊️ Overview

This platform serves as the central hub for the Ethiopian Orthodox Hymn mobile application, providing:
- **Public Website**: Landing page, app downloads, version history, reviews, and feedback
- **Admin Dashboard**: Version management, content moderation, analytics, and user feedback handling  
- **Sacred Design**: Calm, reverent UI with gold accents, smooth animations, and light/dark themes

## 🧱 Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcrypt, express-validator
- **Logging**: Winston

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: React Icons

## 📦 Project Structure

```
orthodox-hymn-platform/
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── config/          # Database, JWT, upload configs
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── models/          # Database models
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   └── utils/           # Logger, validators
│   ├── uploads/             # File storage (APK, audio)
│   ├── logs/                # Application logs
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── config/          # API configuration
│   │   └── styles/          # CSS (design system, animations)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/                # MySQL schemas and seeds
│   ├── schema.sql           # Database structure
│   └── seeds/               # Sample data
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mahletay-app-store.git
   cd mahletay-app-store
   ```

2. **Set up the database**
   ```bash
   # Login to MySQL
   mysql -u root -p

   # Run schema
   source database/schema.sql

   # Optional: Load sample data
   source database/seeds/sample_data.sql
   ```

3. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   npm install
   ```

4. **Configure Frontend**
   ```bash
   cd ../frontend
   cp .env.example .env
   # Edit if needed (defaults should work for local development)
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

3. **Access the application**
   - Public Website: http://localhost:5173
   - API: http://localhost:5000/api
   - Admin Login: http://localhost:5173/admin/login
     - Default credentials: `admin@orthodoxhymn.com` / `Admin@123`

## 🌐 API Endpoints

### Public Endpoints

```
GET    /api/versions                    # Get all app versions
GET    /api/versions/latest             # Get latest version
GET    /api/versions/:id                # Get version by ID
GET    /api/versions/:id/download       # Download APK

GET    /api/reviews                     # Get approved reviews
POST   /api/reviews                     # Submit review

POST   /api/ratings                     # Submit rating
GET    /api/ratings/:versionId/stats    # Get rating statistics

POST   /api/feedback                    # Submit feedback
```

### Admin Endpoints (Require Authentication)

```
POST   /api/auth/login                  # Admin login
POST   /api/auth/logout                 # Logout

POST   /api/versions                    # Create new version (multipart/form-data)
PATCH  /api/versions/:id                # Update version
DELETE /api/versions/:id                # Delete version

PATCH  /api/reviews/:id/approve         # Approve review
PATCH  /api/reviews/:id/feature         # Feature review
DELETE /api/reviews/:id                 # Delete review

GET    /api/feedback                    # Get all feedback
POST   /api/feedback/:id/respond        # Respond to feedback

GET    /api/analytics/dashboard         # Dashboard analytics
```

## 🎨 Design System

### Color Palette

- **Gold Primary**: `#D4AF37` (sacred highlights)
- **Gold Light**: `#E8CC6D`
- **Gold Dark**: `#B8952F`
- **Background Light**: `#FAF8F3`
- **Background Dark**: `#1A1510`

### Typography

- **Headings**: Crimson Text (serif)
- **Body**: Inter (sans-serif)

### Animations

- Smooth transitions: 300-600ms cubic-bezier easing
- Scroll-based fade-ins and reveals
- Magnetic button effects
- Sacred glow animations
- Parallax backgrounds

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Rate limiting on sensitive endpoints
- File upload validation
- Input sanitization

## 📊 Database Schema

The platform uses 7 normalized MySQL tables:

1. **users** - Admin and moderator accounts
2. **app_versions** - Application releases
3. **downloads** - Download tracking
4. **reviews** - User reviews
5. **ratings** - Star ratings (1-5)
6. **feedback** - User feedback (bug/suggestion/blessing)
7. **hymns** - Hymn content management (future feature)

## 🌙 Features

### Public Website
- Sacred landing page with hero section
- App version history with changelogs
- Download latest APK
- Star rating system
- User review submission
- Feedback forms (bug reports, suggestions, blessings)
- About page with mission statement
- Light/dark theme toggle

### Admin Dashboard
- Secure authentication
- Upload and manage app versions
- Moderate and approve reviews
- Feature outstanding reviews
- Respond to user feedback
- Analytics dashboard with statistics
- Download tracking

## 📱 Mobile-First Design

The platform is fully responsive and optimized for:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1280px+)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Update database credentials
3. Set secure JWT secret
4. Configure CORS for your frontend domain
5. Run `npm start`

### Frontend Deployment

1. Update `VITE_API_URL` to your production API URL
2. Run `npm run build`
3. Deploy the `dist/` folder to your hosting service

### Recommended Hosting

- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: PlanetScale, AWS RDS, DigitalOcean Managed MySQL

## 📖 Documentation

- API Documentation: See below
- Database Schema: `database/schema.sql`
- Sample Data: `database/seeds/sample_data.sql`

## 🤝 Contributing

This is a faith-based project. Please ensure all contributions maintain:
- Respectful, sacred tone
- Clean, commented code
- Security best practices
- Accessibility standards

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

This platform was built with reverence and care for the Ethiopian Orthodox Christian community. May it serve the faithful well in their spiritual journey.

---

**Made with faith and dedication** ✝