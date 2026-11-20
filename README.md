# Allergy Advisor MERN

Allergy Advisor is a full-stack web application that helps users record allergy profiles, check foods and ingredient lists, review previous checks, and read weather-related allergy guidance.

> **Safety disclaimer:** This application provides general educational guidance only. It is not medical advice and must not replace product-label checks, a clinician, or emergency services. Users with severe allergies should follow their prescribed emergency plan.

## Features

- JWT-based registration, login, and authenticated sessions
- Bcrypt password hashing
- Personal allergy profile with severity levels
- Food and ingredient safety checking
- Dataset-backed food product matching
- Safe alternatives and practical advice
- Persistent check history in MongoDB
- Allergy knowledge-base management
- Weather-based allergy guidance with OpenWeatherMap and a fallback mode
- Responsive React interface with light/dark theme support
- Helmet security headers, CORS configuration, request logging, and centralized error handling

## Tech stack

- **Frontend:** React 19, Vite, JavaScript, Lucide React
- **Backend:** Node.js, Express, JWT, bcryptjs
- **Database:** MongoDB with Mongoose
- **Data import:** XLSX

## Project structure

```text
client/                 React + Vite frontend
server/src/config/      Database configuration
server/src/controllers/ API request handlers
server/src/middleware/  Authentication and error middleware
server/src/models/      Mongoose models
server/src/routes/      Express routes
server/src/services/    External weather service
server/src/utils/       Allergy matching and token helpers
server/src/seed/        Allergy and food dataset import scripts
server/test/            Backend utility tests
dataset.xlsx            Food product source dataset
```

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection
- Optional: an OpenWeatherMap API key for live weather data

## Local setup

From the project root:

```bash
npm run install:all
```

Create the environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/allergy_advisor
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
OPENWEATHER_API_KEY=your-openweathermap-api-key
```

`OPENWEATHER_API_KEY` is optional. Without it, the application provides general fallback guidance.

Seed the allergy knowledge base and optionally import food products:

```bash
npm run seed
npm run import:foods
```

Run the frontend and backend together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Useful commands

```bash
npm run build       # Build the frontend for production
npm test            # Run backend utility tests
npm run start       # Start the backend
```

## API overview

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| GET | `/api/health` | Check API availability | No |
| POST | `/api/auth/register` | Register a user | No |
| POST | `/api/auth/login` | Log in | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/allergies` | List allergy knowledge | No |
| POST/PUT/DELETE | `/api/allergies` | Manage allergy knowledge | Yes |
| PUT | `/api/profile/allergies` | Save user allergy profile | Yes |
| POST | `/api/checker` | Check food or ingredients | Yes |
| GET | `/api/checker/history` | View recent checks | Yes |
| GET | `/api/weather/advice?city=Lahore` | Get allergy weather guidance | No |

## Testing and verification

The backend includes focused tests for allergen normalization, ingredient matching, risk classification, and dataset-backed matching. The frontend is verified with the Vite production build.

Before publishing, confirm that `.env` files and `node_modules/` are not staged. They are excluded by `.gitignore`.