## ⏱️ Timed Chat – Ephemeral Messaging App

A real-time, short-lived chat application where rooms exist for 10 minutes and automatically expire using Redis TTL (Upstash).
Built to explore Elysia + Bun as a modern backend stack with Next.js & TypeScript on the frontend.

🚀 Features

🕒 10-minute chat rooms (auto-expire using Redis TTL)

🔐 Room-based access (shareable room link)

⚡ Real-time messaging

🧹 Automatic cleanup (no cron jobs needed)

🧠 Stateless backend design

📦 Type-safe API with Elysia & TypeScript

☁️ Serverless-friendly (Upstash Redis)

## 🧩 Tech Stack
Frontend

Next.js

TypeScript

React Query

Tailwind CSS

Backend

Elysia

Bun

TypeScript

Data & Realtime

Upstash Redis

TTL-based room expiration

Message persistence during room lifetime

🏗️ Architecture Overview
Client (Next.js)
   ↓
Elysia API (Bun)
   ↓
Upstash Redis
   ├── room:{roomId}        → TTL = 10 minutes
   ├── messages:{roomId}
   └── meta:{roomId}


Rooms are stored with a TTL of 600 seconds

Once TTL expires, Redis automatically deletes all room data

No manual cleanup or background jobs required

## ⏳ Room Expiry Logic (Redis TTL)
await redis.expire(`room:${roomId}`, ttl (time to live) time-period logic)
})

Every chat room has a fixed lifetime

When TTL ends:

Room becomes inaccessible

Messages are auto-deleted

Clients are redirected

🛠️ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/timed-chat-app.git
cd timed-chat-app

2️⃣ Install Dependencies
bun install

3️⃣ Environment Variables

Create a .env file:

UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token

4️⃣ Run the App
bun dev


Frontend → http://localhost:3000
API → http://localhost:3000/api

🎯 Why This Project?

This project was built to:

Explore Elysia’s type-safe API design

Understand Redis TTL-based expiration

Build ephemeral systems (temporary data)

Learn real-time messaging patterns

Experiment with Bun as a runtime

It’s a great foundation for:

Anonymous chat

Interview collaboration rooms

Temporary support chats

Disposable communication systems

🔮 Possible Improvements

WebSocket-based live updates

User presence indicators

Message encryption

Custom room duration

Rate limiting & abuse protection

📜 License

MIT License
