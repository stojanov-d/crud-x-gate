# CRUD X Gate

## Prerequisites

- Node.js (v14 or higher)
- npm
- Git

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/stojanov-d/crud-x-gate.git
cd crud-x-gate
```

2. Install dependencies:

```bash
npm install

```

3. Start the development server:

```bash
npm start

```

The application should now be running on `http://localhost:3000`

You can test this API using Postman or a software of your choice.

#### All endpoints except /register and /login require authentication via a Bearer token in the authorization header. The token is obtained from the login/register response.

#### The API endpoints are:

```
POST localhost:3000/register
POST localhost:3000/login
```

```
POST localhost:3000/projects
GET localhost:3000/projects
PATCH localhost:3000/projects/:id
DELETE localhost:3000/projects/:id
```

```
POST localhost:3000/projects/:projectId/tasks
GET localhost:3000/projects/:projectId/tasks
PATCH localhost:3000/tasks/:id
DELETE localhost:3000/tasks/:id
```
