# Safora Kids AI

Safora Kids AI is an adaptive safety-learning web app for children. It helps students learn practical safety topics through daily quiz sessions, personalized question selection, immediate feedback, spaced review, mastery tracking, and progress dashboards.

The app is designed around child-focused safety education, covering topics such as road safety, natural disaster preparedness, household hazards, basic first aid, and hygiene habits.

## What the App Does

- Provides students with a daily safety-learning quiz session.
- Selects questions from multiple safety modules to keep learning balanced.
- Uses adaptive logic to prioritize weak topics, repeated mistakes, due reviews, and suitable difficulty levels.
- Gives instant feedback after every answer, including the correct answer and explanation.
- Tracks module-level mastery for each student.
- Schedules review questions using spaced repetition so students revisit concepts over time.
- Awards XP and badges for progress.
- Shows students their score trends, mastery levels, weak topics, and assessment status.
- Gives admins dashboards for student progress, weak concepts, question coverage, AI/adaptive selection activity, and retention indicators.

## Safety Modules

The app currently includes five main learning modules:

- Traffic and road safety
- Natural disaster preparedness
- Household and occupational hazards
- Basic first aid
- Good habits and hygiene

Each question includes learning metadata such as module, subtopic, difficulty, concept depth, mastery concept, explanation, and learning objective.

## Adaptive Learning Approach

Safora Kids AI uses a rule-based adaptive learning engine. The system ranks eligible questions using factors such as:

- Low mastery in a safety module
- Recent incorrect answers
- Concepts that need repeated practice
- Questions due for spaced review
- Difficulty level matched to the learner's progress

This makes the app more personalized than a static quiz system. Each student's future sessions are influenced by their own learning history.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Recharts
- Zod
- bcryptjs
- jose JWT authentication
- pnpm

## Main Features

## Student Features

- Register and log in
- Start daily learning sessions
- Answer multiple-choice safety questions
- Receive instant feedback and explanations
- Track XP, badges, scores, weak topics, and mastery
- Complete final assessment based on consistent performance

## Admin Features

- View student progress and completion status
- Monitor pass, fail, and in-progress counts
- Analyze weak safety concepts
- View question distribution by module, difficulty, and concept depth
- Track adaptive question usage and retention success
- Configure session off days

## Project Structure

```text
app/                  Next.js app routes and API routes
prisma/               Prisma schema and migrations
scripts/              Seed scripts
src/components/       Shared React components
src/lib/              Auth, session, mastery, dashboard, AI, and utility logic
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Set up environment variables:

```bash
cp .env.example .env
```

Update `.env` with your database connection string and JWT secret.

Generate the Prisma client:

```bash
pnpm prisma:generate
```

Run database migrations:

```bash
pnpm prisma:migrate
```

Seed demo data:

```bash
pnpm prisma:seed
```

Start the development server:

```bash
pnpm dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Demo Accounts

After seeding, the demo admin account is:

```text
Student ID: admin
Password: admin123
```

Demo student accounts use:

```text
Password: student123
```

## Notes

The current adaptive engine is explainable and rule-based. It is structured so future versions can add stronger AI features such as personalized explanations, misconception detection, and AI-assisted question generation.
