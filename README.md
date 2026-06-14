 SpendWise AI 💰
A full-stack AI-powered expense tracker built with React, FastAPI, and MongoDB.

SpendWise AI FastAPI MongoDB Groq AI

✨ Features
📊 Dashboard — Visual overview of all expenses
➕ Add/Delete Expenses — Manage expenses in real time
🤖 AI Assistant — Chat with AI about your spending
📈 Reports & Charts — Pie and bar charts by category
💾 Persistent Storage — Data saved in MongoDB Atlas
🎨 Beautiful UI — Light purple minimal design
🛠️ Tech Stack
Layer	Technology
Frontend	React.js + Tailwind CSS
Backend	FastAPI (Python)
Database	MongoDB Atlas
AI	Groq API (Llama 3)
Charts	Recharts
🚀 How to Run Locally
Prerequisites
Node.js v22+
Python 3.11+
MongoDB Atlas account
Groq API key (free at console.groq.com)
1. Clone the repo
git clone https://github.com/amruthasaireddy/expense-tracker-ai.git
cd expense-tracker-ai
2. Setup Backend
cd backend
python -m venv venv
source venv/Scripts/activate
pip install fastapi uvicorn pymongo python-dotenv groq
Create .env file in backend folder: Run backend:

uvicorn main:app --reload
3. Setup Frontend
cd frontend
npm install
npm start
4. Open in browser
http://localhost:3000

📁 Project Structure
expense-tracker-ai/

├── frontend/ # React app

│ ├── src/

│ │ ├── App.js # Main dashboard

│ │ └── Reports.js # Charts & analytics

│ └── package.json

├── backend/ # FastAPI server

│ ├── main.py # API routes + AI

│ ├── database.py # MongoDB connection

│ ├── models.py # Data models

│ └── .env # Secret keys (not in git)

└── README.md
