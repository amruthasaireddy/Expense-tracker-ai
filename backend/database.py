from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["expense_tracker"]
collection = db["expenses"]

def get_expenses():
    expenses = []
    for expense in collection.find():
        expense["_id"] = str(expense["_id"])
        expenses.append(expense)
    return expenses

def add_expense(expense):
    result = collection.insert_one(expense)
    expense["_id"] = str(result.inserted_id)
    return expense

def delete_expense(id):
    collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Expense deleted"}