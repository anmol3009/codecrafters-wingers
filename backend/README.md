# SARASWATI Backend

> Node.js + Express + Firebase backend for the SARASWATI AI-powered EdTech platform.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Database | Firestore (Firebase) |
| Auth | Firebase Auth (Google + Email/Password) |
| Token Verification | Firebase Admin SDK |

---

## Project Structure

```
backend/
├── src/
│   ├── app.js                  ← Entry point
│   ├── config/
│   │   └── firebase.js         ← Firebase Admin SDK init
│   ├── data/
│   │   ├── courses.js          ← Static course catalogue (6 courses)
│   │   └── conceptGraph.js     ← Prerequisite dependency graph
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── progressController.js
│   │   ├── mcqController.js
│   │   ├── insightsController.js
│   │   └── paymentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── mcqRoutes.js
│   │   ├── insightsRoutes.js
│   │   └── paymentRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── courseService.js
│   │   ├── progressService.js
│   │   ├── conceptService.js   ← Root-cause tracing engine
│   │   └── insightsService.js
│   └── middleware/
│       ├── authMiddleware.js   ← Firebase token verification
│       └── errorHandler.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. **Project Settings → Service Accounts → Generate new private key**
3. Copy the values into your `.env` file:

```bash
cp .env.example .env
```

Fill in `.env`:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
CLIENT_URL=http://localhost:5173
```

> **Important:** The private key must have literal `\n` characters — wrap the entire value in double quotes.

### 3. Enable Firestore and Auth in Firebase Console

- Firestore Database → Create database (Start in test mode for dev)
- Authentication → Sign-in method → Enable **Email/Password** and **Google**

---

## Running Locally

```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm start
```

The server starts on **http://localhost:5000**

Health check: `GET http://localhost:5000/health`

---

## API Reference

### Auth (all require `Authorization: Bearer <idToken>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create Firestore user doc after Firebase signup |
| POST | `/auth/login` | Verify token, ensure user doc exists |
| POST | `/auth/google` | Google sign-in sync |
| GET | `/auth/me` | Get current user profile |

### Courses (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List all courses |
| GET | `/courses?subject=Mathematics&level=Beginner` | Filtered list |
| GET | `/courses/:id` | Course detail with sanitized syllabus |

### Enrollment (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/enroll/:courseId` | Enroll + simulate payment |
| GET | `/my-courses` | Enrolled courses for current user |

### Progress (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/progress/video-complete` | Mark video watched, unlock MCQ |
| GET | `/progress/:courseId` | Get progress for a course |

### MCQ (auth required)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/mcq/submit` | `{ courseId, sectionId, questionId, selectedAnswer }` | Submit answer — triggers concept trace on incorrect |

### Teacher Insights (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teacher-insights/math` | Dynamic Math analytics |

### Payment (auth required)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/payment` | `{ courseId, amount, currency }` | Simulated payment (always succeeds) |

---

## Key Concepts

### Concept Graph

The backend maintains a prerequisite dependency graph in `src/data/conceptGraph.js`:

```js
{
  'Arithmetic': [],
  'Algebra Basics': ['Arithmetic'],
  'Linear Equations': ['Algebra Basics'],
  'Quadratic Equations': ['Linear Equations'],
  ...
}
```

### MCQ Incorrect Flow

When a student answers incorrectly:

1. The failed concept's `conceptTag` is identified (e.g. `Quadratic Equations`)
2. `traceRootCause()` walks the graph to find the deepest root (e.g. `Arithmetic`)
3. The earliest course section covering the root concept is found
4. Progress is reset back to that section
5. Response includes `rootCause`, `path`, `restartFromSectionId`, and a human-friendly message

### Firestore Structure

```
users/
  {uid}/
    name: string
    email: string
    enrolledCourses: string[]
    progress:
      {courseId}:
        currentSection: string
        completedSections: string[]
        videoWatched: string[]
        mcqStatus: { [sectionId]: 'correct' | 'incorrect' }
        incorrectConcepts: { [conceptTag]: count }
    createdAt: string
```

---

## Frontend Integration

The frontend runs on `http://localhost:5173`.  
Set `CLIENT_URL=http://localhost:5173` in `.env` to allow CORS.

Every authenticated request must include:
```
Authorization: Bearer <Firebase ID Token>
```

Get the token client-side:
```js
const token = await firebase.auth().currentUser.getIdToken();
```
