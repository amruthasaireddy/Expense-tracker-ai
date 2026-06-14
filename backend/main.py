from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_expenses, add_expense, delete_expense
from models import Expense

app = FastAPI()

# Allow React frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get all expenses
@app.get("/expenses")
async def read_expenses():
    return get_expenses()

# Add new expense
@app.post("/expenses")
async def create_expense(expense: Expense):
    return add_expense(expense.dict())

# Delete expense
@app.delete("/expenses/{id}")
async def remove_expense(id: str):
    return delete_expense(id)