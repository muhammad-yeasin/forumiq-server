# ForumIQ — API Server

This repository contains the backend API server for ForumIQ — an Express + TypeScript application using MongoDB, JWT authentication, and optional AI features (Google Gemini via `@google/genai`).

Live API documentation
----------------------

- API docs (interactive): https://forumiq.apidog.io
  - Use this to explore endpoints, schemas, and try calls with a token.
  - Typical flow: Signup -> Signin -> copy the `accessToken` and use it in the `Authorization: Bearer <token>` header when trying protected endpoints.

Quick start (local)
-------------------

Prerequisites
 - Node.js 18+ (Node 20 recommended)
 - pnpm (or npm/yarn)
 - MongoDB (local or remote)

1. Clone and install

```bash
git clone https://github.com/muhammad-yeasin/forumiq-server.git
cd forumiq-server
pnpm install
```

2. Create environment file

Copy the example and edit values:

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL, ACCESS_TOKEN_SECRET, etc.
```

3. Run locally (development)

```bash
pnpm dev
# The server will start and connect to MongoDB using DATABASE_URL from your .env
```

4. Build and run (production)

```bash
pnpm build
pnpm start
```

Docker (optional)
-----------------

The repository contains a `Dockerfile`. Build and run locally:

```bash
docker build -t forumiq-server:local .
docker run --rm -p 8000:8000 --env-file .env forumiq-server:local
```

If you deploy in Docker Swarm behind Traefik, ensure the container listens on `0.0.0.0` and use labels similar to the example stack file shown in the repo. Add a healthcheck so Traefik only routes to healthy containers.

Environment variables
---------------------

See `.env.example` for all variables. Important ones:
- `DATABASE_URL` — MongoDB connection string
- `ACCESS_TOKEN_SECRET` — JWT signing secret
- `ACCESS_TOKEN_EXPIRES_IN` — JWT expiry (e.g. `30d`)
- `GENAI_API_KEY` — optional Google GenAI API key for AI features

Testing
-------

Tests are written using Jest + Supertest and live under `__tests__/`.

Run tests:

```bash
pnpm test
pnpm test -- --coverage
```

The test harness connects to the test MongoDB (defaults to `mongodb://127.0.0.1:27017/forumiq_test`). You can override using `DATABASE_URL` in your shell when running tests.

Folder structure
----------------

Top-level:

- `src/` — application source code
  - `app.ts` — Express app (no server listen) used by tests and index
  - `index.ts` — server startup and Socket.IO wiring
  - `config/` — environment config
  - `db/` — database connection helper
  - `middlewares/` — custom middlewares
  - `modules/` — feature modules (auth, users, threads, posts, notifications, ai)
    - `auth/` — auth controller/service/route
    - `threads/` — thread model/service/controller/route
    - `posts/` — posts model/service/controller/route
    - `notifications/` — notifications module
    - `ai/` — AI integration (optional)
  - `routes/` — top-level route mounting (`/api/v1`)
  - `utils/` — utilities (jwt, bcrypt, api features, socket helpers, AppError)

- `__tests__/` — integration tests using supertest
- `jest.config.js` and `jest.setup.ts` — test configuration and lifecycle hooks
- `.env.example` — example environment variables
- `Dockerfile` — production build image

How to change code
-------------------

- Add routes: create module folder under `src/modules/<feature>` with `*.model.ts`, `*.service.ts`, `*.controller.ts`, `*.route.ts`. Then mount the route in `src/routes/v1/index.ts`.
- Add middleware: create a file in `src/middlewares/` and export from `src/middlewares/index.ts` to include in `app.ts` via `applyMiddleware`.
- Use services for business logic and controllers for request/response handling. Services should export small functions and avoid direct `req/res` usage so they remain testable.
- For DB models use Mongoose in `src/modules/<module>/<name>.model.ts` and export typed models/interfaces.

API documentation
-----------------

Interactive API docs are available at: https://forumiq.apidog.io

How to use:
 - Open the link and browse endpoints.
 - For protected endpoints: Signup (POST /api/v1/auth/signup) -> Signin (POST /api/v1/auth/signin). Copy the `accessToken` from signin response.
 - Click "Authorize" in the docs UI and paste `Bearer <accessToken>`.

AI features
-----------

The app includes optional AI features using Google GenAI (`@google/genai`) — summarization and post analysis. To enable:

1. Set `GENAI_API_KEY` in your `.env` (or `GOOGLE_API_KEY`).
2. Install the SDK in the runtime image if not already present:

```bash
pnpm add @google/genai
```

3. The AI endpoints are protected and available under `/api/v1/ai`.