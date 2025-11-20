# Boo Personality Database

A Node.js web application for managing personality profiles with MBTI, Enneagram, and Zodiac information for celebrities and fictional characters.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## ✨ Features

- Create and manage personality profiles
- Support for multiple personality typing systems:
  - **MBTI** (Myers-Briggs Type Indicator)
  - **Enneagram** (with wings)
  - **Zodiac** signs
  - Socionics, SLOAN, Psyche, Tritype, and Variant
- Comment system for profiles
- RESTful API
- Server-side rendering with EJS templates
- In-memory MongoDB for development and testing
- Comprehensive E2E test suite

## 🛠 Tech Stack

- **Runtime**: Node.js v16+
- **Framework**: Express.js v4.17.1
- **Database**: MongoDB (via MongoDB Memory Server)
- **ODM**: Mongoose v8.19.3
- **Template Engine**: EJS v3.1.6
- **Validation**: Joi v18.0.1
- **Testing**: Jest v29.7.0 + Supertest v6.3.4

## 📦 Prerequisites

Before running this application, make sure you have:

- **Node.js** v16.0.0 or higher
- **npm** v7.0.0 or higher

Check your versions:
```bash
node --version
npm --version
```

## 🚀 Installation

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd server
```

2. **Install dependencies**:
```bash
npm install
```

This will install all required packages including:
- Express.js and middleware
- MongoDB Memory Server
- Mongoose
- EJS templating engine
- Validation libraries
- Testing frameworks

## ▶️ Running the Application

### Development Mode

Start the server:
```bash
node app.js
```

The server will start on **port 3000** by default.

You should see:
```
uri mongodb://127.0.0.1:<port>/
Express started. Listening on 3000
```

### Access the Application

- **Health Check**: http://localhost:3000/
- **API Base URL**: http://localhost:3000/

### Custom Port

To run on a different port:
```bash
PORT=8080 node app.js
```

## 📡 API Endpoints

### Health Check
```http
GET /
```
Returns: `"HELLO FROM BOO WORLD"`

### Profile Endpoints

#### Get All Profiles
```http
GET /profile
```
Returns: List of all profiles

#### Create Profile
```http
POST /profile
Content-Type: application/json

{
  "name": "John Doe",
  "description": "Software Engineer",
  "mbti": "INTJ",
  "enneagram": "5w4",
  "variant": "sp/sx",
  "tritype": 548,
  "socionics": "ILI",
  "sloan": "RCOEI",
  "psyche": "VLEF",
  "image": "https://example.com/image.jpg"
}
```

**Required fields**: `name`

**Valid MBTI types**: INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP

**Valid Enneagram types**: 1w2, 2w3, 3w2, 3w4, 4w3, 4w5, 5w4, 5w6, 6w5, 6w7, 7w6, 7w8, 8w7, 8w9, 9w8, 9w1

#### Get Single Profile
```http
GET /profile/:id
```
Returns: HTML page with profile details

### Comment Endpoints

#### Get All Comments
```http
GET /comment
```
Returns: List of all comments

#### Create Comment
```http
POST /comment
Content-Type: application/json

{
  "profileId": "507f1f77bcf86cd799439011",
  "senderId": "507f191e810c19729de860ea",
  "title": "Great profile!",
  "content": "Very accurate description",
  "mbti": "INTJ",
  "enneagram": "5w4",
  "zodiac": "Scorpio"
}
```

**Required fields**: `profileId`, `senderId`, `title`, `content`

**Valid Zodiac signs**: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

## 🧪 Testing

This project includes a comprehensive E2E test suite with 23 tests covering all endpoints.

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run testw
```

### Run Specific Test File
```bash
npx jest __test__/profile.test.js
npx jest __test__/comment.test.js
npx jest __test__/integration.test.js
npx jest __test__/app.test.js
```

### Test Coverage
```bash
npx jest --coverage
```

### Test Results
```
Test Suites: 4 passed, 4 total
Tests:       23 passed, 23 total
```

**Test Files:**
- `__test__/app.test.js` - General app and health check tests
- `__test__/profile.test.js` - Profile endpoint tests (9 tests)
- `__test__/comment.test.js` - Comment endpoint tests (6 tests)
- `__test__/integration.test.js` - Full workflow integration tests (4 tests)

## 📁 Project Structure

```
server/
├── __test__/              # Test files
│   ├── app.test.js
│   ├── profile.test.js
│   ├── comment.test.js
│   └── integration.test.js
├── constants/             # Constants and enums
│   ├── MBTI.js
│   ├── ENNEAGRAM.js
│   └── ZODIAC.js
├── controllers/           # Route controllers
│   ├── profile.js
│   ├── comment.js
│   └── errHandler.js
├── routes/                # API routes
│   ├── profile.js
│   └── comment.js
├── schemas/               # Mongoose schemas
│   ├── profile.js
│   └── comment.js
├── utils/                 # Utility functions
│   ├── errors.js
│   └── request-validation/
├── views/                 # EJS templates
│   ├── profile_template.ejs
│   └── partials/
├── public/                # Static files
│   └── static/
├── app.js                 # Application entry point
├── app.config.js          # App configuration
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup
├── jest.teardown.js       # Jest teardown
├── package.json           # Dependencies
└── README.md              # This file
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | - | Environment (`test`, `development`, `production`) |

### Setting Environment Variables

**Linux/Mac:**
```bash
export PORT=8080
export NODE_ENV=development
node app.js
```

**Windows (CMD):**
```cmd
set PORT=8080
set NODE_ENV=development
node app.js
```

**Windows (PowerShell):**
```powershell
$env:PORT=8080
$env:NODE_ENV="development"
node app.js
```

## 🗄️ Database

This application uses **MongoDB Memory Server** for both development and testing:

- ✅ No MongoDB installation required
- ✅ In-memory database (fast and isolated)
- ✅ Automatic setup and teardown
- ✅ Perfect for development and testing

The database is automatically initialized when the app starts. You'll see the MongoDB URI in the console:
```
uri mongodb://127.0.0.1:<random-port>/
```

## 📝 Example Usage

### Create a Profile
```bash
curl -X POST http://localhost:3000/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sherlock Holmes",
    "description": "Consulting Detective",
    "mbti": "INTJ",
    "enneagram": "5w6"
  }'
```

### Get All Profiles
```bash
curl http://localhost:3000/profile
```

### Create a Comment
```bash
curl -X POST http://localhost:3000/comment \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "507f1f77bcf86cd799439011",
    "senderId": "507f191e810c19729de860ea",
    "title": "Spot on!",
    "content": "This typing is very accurate",
    "mbti": "INTJ"
  }'
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
PORT=3001 node app.js
```

### MongoDB Memory Server Issues
If you encounter MongoDB Memory Server errors:
1. Clear npm cache: `npm cache clean --force`
2. Reinstall dependencies: `rm -rf node_modules && npm install`

### Test Failures
If tests fail:
1. Ensure Node.js version is 16+
2. Clear Jest cache: `npx jest --clearCache`
3. Run tests with verbose output: `npx jest --verbose`

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 🔗 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Jest Documentation](https://jestjs.io/)
- [MBTI Types](https://www.16personalities.com/)
- [Enneagram Types](https://www.enneagraminstitute.com/)

