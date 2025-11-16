# CivicVoice

An anonymous community reporting & mediation platform aligned with UN SDG 16 (Peace, Justice & Strong Institutions).

## 🚀 Features

- **Anonymous Reporting**: Citizens can report issues without revealing their identity
- **Real-time Updates**: Socket.io integration for live notifications
- **Location-based**: GeoNear queries to find reports within 10km radius
- **Role-based Access**: Support for citizens, mediators, and administrators
- **Image Upload**: Cloudinary integration for report images
- **Modern UI**: Beautiful React frontend with Tailwind CSS

## 🏗️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zod validation
- Leaflet maps

### Backend
- Node.js 20 + Express + TypeScript
- MongoDB Atlas with Mongoose
- JWT authentication with httpOnly cookies
- Socket.io for real-time features
- Multer + Cloudinary for file uploads

### Deployment
- Docker containerization
- Environment-based configuration

## 📁 Project Structure

```
/
├── packages/
│   ├── client/          # React frontend
│   └── server/          # Express backend
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Cloudinary account (optional)
- GitHub account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/civicvoice.git
   cd civicvoice
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm install
   ```

3. **Environment Setup**

   Copy the example environment file:
   ```bash
   cp packages/server/.env.example packages/server/.env
   ```

   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5174
   # Optional: Cloudinary configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the development servers**

   ```bash
   # Terminal 1: Start the backend
   cd packages/server
   npm run dev

   # Terminal 2: Start the frontend
   cd ../client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Reports
- `POST /api/v1/reports` - Create new report
- `GET /api/v1/reports` - Get reports near location
- `GET /api/v1/reports/my` - Get user's reports
- `PATCH /api/v1/reports/:id` - Update report status

### Mediator Dashboard
- `GET /api/v1/mediator/dashboard` - Get mediator dashboard

## 🗄️ Database Schema

### User
- Email, password, role (citizen/mediator/admin)
- Name, avatar

### Report
- Title, description, category
- Location (GeoJSON Point)
- Status, assigned mediator
- Anonymous flag, user reference

### Comment
- Report reference, user reference
- Body, isMediator flag

### Resolution
- Report reference, mediator reference
- Outcome, public summary

## 🚢 Deployment

### Docker Deployment

1. **Build the Docker image**
   ```bash
   cd packages/server
   docker build -t civicvoice-server .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 --env-file .env civicvoice-server
   ```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- `NODE_ENV=production`
- `CLIENT_URL=your-frontend-url`
- Valid MongoDB Atlas connection string
- Strong JWT secret
- Cloudinary credentials (if using image uploads)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🎯 UN SDG 16 Alignment

This platform contributes to:
- **16.6**: Develop effective, accountable and transparent institutions
- **16.7**: Ensure responsive, inclusive, participatory and representative decision-making
- **16.10**: Ensure public access to information and protect fundamental freedoms

---

Built with ❤️ for community empowerment