# Liora frontend

## Setup

1. Scaffold the project (App Router, TypeScript, Tailwind v4, src dir, @/* alias):

       npx create-next-app@latest liora-web

   Answer: TypeScript yes, ESLint yes, Tailwind yes, src/ yes, App Router yes,
   Turbopack yes, import alias yes (keep the default @/*).

2. Copy the `src/` folder from this zip over the generated `src/`, replacing
   `app/layout.tsx`, `app/page.tsx` and `app/globals.css`.

3. Create `.env.local` in the project root:

       NEXT_PUBLIC_API_URL=http://localhost:8000

4. Run it:

       npm run dev

Backend must be running on port 8000 with CORS allowing http://localhost:3000.

## Routes

    /                    redirects based on session
    /login
    /signup
    /dashboard           greeting, progress, categories, recent items
    /board               masonry board, filter by category and status
    /board?category=3    opens one category
    /categories          create, rename, delete

## Backend endpoints used

    POST   /users/
    POST   /auth/login          form encoded, field named "username"
    GET    /auth/me
    GET    /categories/
    POST   /categories/
    PATCH  /categories/{id}
    DELETE /categories/{id}
    GET    /vision-items/?category_id=
    POST   /vision-items/
    PATCH  /vision-items/{id}
    DELETE /vision-items/{id}
