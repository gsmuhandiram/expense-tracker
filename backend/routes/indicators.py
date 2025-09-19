from fastapi import APIRouter
from services.sheet_service import fetch_transactions
from services.calc_service import calculate_indicators

router = APIRouter()

@router.get("/")
def get_indicators():
    records = fetch_transactions()
    return {"indicators": calculate_indicators(records)}
