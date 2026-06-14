from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_expenses, add_expense, delete_expense
from models import Expense, AIQuery
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/expenses")
async def read_expenses():
    return get_expenses()

@app.post("/expenses")
async def create_expense(expense: Expense):
    return add_expense(expense.dict())

@app.delete("/expenses/{id}")
async def remove_expense(id: str):
    return delete_expense(id)

@app.post("/ai/chat")
async def ai_chat(query: AIQuery):
    expenses = get_expenses()
    
    expenses_text = "\n".join([
        f"- {e['name']} | {e['category']} | Rs.{e['amount']} | {e['date']}"
        for e in expenses
    ])
    
    total = sum(e['amount'] for e in expenses)
    
    prompt = f"""
You are a helpful personal finance assistant for an Indian expense tracker app.
Here are the user's expenses:

{expenses_text}

Total spent: Rs.{total}
Budget: Rs.30000

User question: {query.question}

Give a short helpful answer in 2-3 sentences. Use Rs. for currency.
"""
    
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150
    )
    
    return {"answer": response.choices[0].message.content}