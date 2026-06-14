from pydantic import BaseModel

class Expense(BaseModel):
    name: str
    category: str
    amount: float
    date: str