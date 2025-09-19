from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime

app = FastAPI()

# Allow frontend to access backend
origins = [
    "http://localhost:3000",  # React local dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Google Sheets connection
scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]
creds = ServiceAccountCredentials.from_json_keyfile_name(
    "credentials.json", scope
)
client = gspread.authorize(creds)

# Replace with your actual sheet name
sheet1 = client.open("ExpenseTracker").sheet1


@app.post("/transactions")
async def add_transaction(transaction: dict):
    """Save new transaction to Google Sheet"""
    sheet1.append_row([
        transaction["date"],
        transaction["description"],
        transaction["amount"],
        transaction["type"],
        ",".join(transaction.get("categories", [])),  # array → string
    ])
    return {"status": "success"}


@app.get("/transactions")
async def get_transactions():
    """Fetch all transactions from Google Sheet"""
    records = sheet1.get_all_records()

    # Add row index as ID and split categories back into a list
    transactions = []
    for i, r in enumerate(records, start=2):  # start=2 (row 1 = headers)
        transactions.append({
            "id": i,
            "date": r.get("Date"),
            "description": r.get("Description"),
            "amount": r.get("Amount"),
            "type": r.get("Type"),
            "categories": r.get("Categories", "").split(",") if r.get("Categories") else []
        })
    return {"transactions": transactions}

