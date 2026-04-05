# Ai-Task-Processing-System
Built an AI-ready asynchronous task processing platform using Node.js, Redis, and Python with a scalable producer-consumer architecture. Designed to support pluggable AI workloads (e.g., text processing, NLP tasks) with real-time status tracking using MongoDB and secure REST APIs with JWT authentication.
---

## 🧠 Features

* 🔐 User Authentication (JWT + bcrypt)
* 🧾 Create and manage tasks
* ⚙️ Asynchronous task processing using Redis queue
* 🐍 Python worker for background job execution
* 📊 Real-time task status tracking (pending → running → success/failed)
* 📄 Logs and results for each task
* 🔁 Retry mechanism for failed tasks
* 🛡️ Secure APIs with Helmet & Rate Limiting

---

## 🏗️ Tech Stack

| Layer    | Technology        |
| -------- | ----------------- |
| Frontend | React (Vite)      |
| Backend  | Node.js + Express |
| Worker   | Python            |
| Database | MongoDB           |
| Queue    | Redis             |
| Auth     | JWT + bcrypt      |

---

## ⚙️ System Architecture

```
Frontend → Backend → MongoDB → Redis Queue → Python Worker → MongoDB → Frontend
```

---

<!-- ## 📦 Project Structure

```
backend/
frontend/
worker/
``` -->

---

## 🚀 Getting Started (Local Setup)

### 🔧 Prerequisites

* Node.js
* Python (3.8+)
* MongoDB (local or Atlas)
* Redis

---

## 🖥️ 1. Clone Repository

```bash
git clone <your-repo-url>
cd your-project
```

---

## 🔌 2. Setup Backend

```bash
cd backend
npm install
```

### Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_task_processor
JWT_SECRET=your_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Run backend:

```bash
npm run dev
```

---

## 🧠 3. Setup Worker

```bash
cd worker
pip install -r requirements.txt
```

### Run worker:

```bash
python worker.py
```

---

## 🎨 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Access App

```
Frontend → http://localhost:5173
Backend → http://localhost:5000
```

---

## 🐳 Docker Setup (Optional)

```bash
docker-compose up --build
```

---

## 🔄 Task Flow

1. User creates task
2. Task stored in MongoDB (status: pending)
3. Task pushed to Redis queue
4. Worker picks task → status: running
5. Worker processes task → status: success/failed
6. Frontend polls and updates UI

---

## 🛡️ Security

* JWT Authentication
* Password hashing (bcrypt)
* Helmet middleware
* Rate limiting

---

## 📈 Scalability

* Horizontal scaling of workers
* Redis-based queue for load distribution
* Stateless architecture

---

## 🤖 AI Capability (Extendable)

The system is designed to support AI workloads such as:

* Text summarization
* Sentiment analysis
* NLP tasks

(Current implementation includes basic string operations)

---

## 📌 Future Improvements

* WebSockets for real-time updates
* Kubernetes deployment
* Argo CD integration
* CI/CD pipeline
* Dead Letter Queue (DLQ)

---

## 👨‍💻 Author

Parth Patel

---

## ⭐ If you like this project, give it a star!
