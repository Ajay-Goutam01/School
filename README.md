# School Website + Admin CMS

## Environment Variables

Copy `.env.example` to `.env` and provide values through the server runtime environment:

```env
MONGO_URI=
JWT_SECRET=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
FRONTEND_URL=
PORT=5000
NODE_ENV=development
```

`IMAGEKIT_*` values are required for managed image uploads in production. `FRONTEND_URL` must be the deployed frontend origin in production. Never expose `MONGO_URI`, `JWT_SECRET`, or `IMAGEKIT_PRIVATE_KEY` to the frontend.

## Local Development

1. Install dependencies in `server/` and `client/`.
2. Configure a local `.env` with `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL=http://localhost:5173`.
3. Start the API with `npm start` from `server/`.
4. Start the frontend with `npm run dev` from `client/`.

The frontend uses `VITE_API_BASE_URL` when supplied; otherwise it uses `/api` and the Vite development proxy.

## Database Setup

The API requires a reachable MongoDB instance. Run `npm run seed` only for non-production demo data. Seeding does not create an admin account and clears seeded content collections, so do not run it against a real school database.

## ImageKit Setup

Set all three ImageKit variables before using admin image uploads. Images are restricted to JPG, PNG, and WEBP files up to 5 MB. The server stores ImageKit file IDs with content records and performs reference checks before deletion.

## Admin Setup

Create the first account through the standalone CLI:

```text
npm run create-admin
```

The CLI asks for the admin name, email, and temporary password. The password is bcrypt-hashed by the Admin model and `mustChangePassword` is set to `true`. Existing accounts are never overwritten.

For a verified password reset, run:

```text
npm run reset-admin
```

The reset is developer-operated, sets `mustChangePassword=true`, and does not expose a public endpoint. Forgot Password is intentionally not implemented.

Production admin operations require explicit authorization variables. For reset:

```env
ALLOW_ADMIN_RESET=true
CONFIRM_ADMIN_RESET=YES
```

Creation uses the equivalent `ALLOW_ADMIN_CREATE=true` and `CONFIRM_ADMIN_CREATE=YES` variables. These are never enabled automatically.

## Build and Deployment

Build the frontend with `npm run build` from `client/`. Run the backend with `npm start` from `server/`. Configure the hosting platform with the required environment variables before startup; production startup does not create or reset administrators.

For an authorized production image cleanup, also set `ALLOW_IMAGE_CLEANUP=true`, `CONFIRM_IMAGE_CLEANUP=YES`, and pass `--confirm` to `npm run cleanup-images`.
