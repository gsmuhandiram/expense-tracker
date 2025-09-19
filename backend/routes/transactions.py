from fastapi import APIRouter
from services.sheet_service import fetch_transactions, add_transaction

router = APIRouter()

@router.get("/")
def get_transactions():
    records = fetch_transactions()
    for r in records:
        if isinstance(r.get("categories"), str):
            r["categories"] = [s.strip() for s in r["categories"].split(",") if s.strip()]
    return {"transactions": records}

@router.post("/")
def create_transaction(tx: dict):
    transactions = add_transaction(tx)
    return {"status": "Transaction added successfully", "transactions": transactions}