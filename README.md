# CodeQuest - Your Ultimate Coding Hub

CodeQuest is a comprehensive platform that aggregates the best coding interview questions from popular platforms like LeetCode, Codeforces, HackerRank, and more. It provides an intuitive coding environment, real-time discussions, and progress tracking to help developers excel in coding interviews.

## Features 🚀
- **Aggregated Coding Problems** from various platforms.
- **Integrated Code Editor** for solving problems directly on the platform.
- **Real-time Discussions** powered by WebSockets for interactive learning.
- **Progress Tracking** to help users monitor their preparation journey.
- **Advanced Filtering & Search** for seamless navigation.
- **Authentication** using NextAuth with Google and Credential Providers.

---

## Tech Stack 🛠️

### Frontend
- **Next.js** with TypeScript
- **TailwindCSS** for styling

### Backend
- **Node.js** with API routes

### Database
- **PostgreSQL** with Prisma ORM

### Deployment & DevOps
- **Vercel** for deployment
- **Prometheus**, **Grafana**, and **Loki** for monitoring and scaling

### State Management
- **Zustand**

---

## Getting Started 🏗️

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/codequest.git
cd codequest
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/codequest
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## Database Setup 🗄️

1. Install PostgreSQL if not already installed:
```bash
sudo apt update && sudo apt install postgresql
```

2. Start PostgreSQL Service:
```bash
sudo service postgresql start
```

3. Access PostgreSQL:
```bash
sudo -u postgres psql
```

4. Create a new database:
```sql
CREATE DATABASE codequest;
```

5. Run Prisma Migrations:
```bash
npx prisma migrate dev
```

6. Generate Prisma Client:
```bash
npx prisma generate
```

---

## NextAuth Configuration 🔐

1. Add Google OAuth credentials in the `.env` file.
2. In your `auth/[...nextauth].ts` file:

```ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = { id: "1", name: "Admin", email: credentials?.email };
        return user || null;
      }
    })
  ],
};

export default NextAuth(authOptions);
```

---

## Running the Application ▶️

1. Start the development server:
```bash
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contributing 🤝
We welcome contributions to improve CodeQuest! Feel free to submit issues, pull requests, or new feature suggestions.

---

## License 📜
This project is licensed under the [MIT License](./License).


