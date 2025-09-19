import gspread
import os

# Build path to credentials.json inside services folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(BASE_DIR, "credentials.json")

# Singleton Google client (only initialized once)
_gc = None
_sh = None

def get_client():
    """Return gspread client (lazy load). This method prevents from using gspread service account calls 
    repeatedly"""
    global _gc
    if _gc is None:
        _gc = gspread.service_account(filename=CREDENTIALS_PATH)
    return _gc

def get_sheet(sheet_name="Sheet1"):
    """Open worksheet by name from ExpenseTracker Google Sheet."""
    gc = gspread.service_account(filename="services/credentials.json")
    sh = gc.open("ExpenseTracker")
    return sh.worksheet(sheet_name)


# ---- Transactions ----
def fetch_transactions():
    """Fetch all transaction records from Sheet1."""
    ws = get_sheet("Sheet1")
    return ws.get_all_records()

def add_transaction(tx: dict):
    """Append a new transaction row to Sheet1."""
    ws = get_sheet("Sheet1")
    ws.append_row([
        tx.get("id"),
        tx.get("date"),
        tx.get("description"),
        tx.get("amount"),
        tx.get("type"),
        ", ".join(tx.get("categories", []))  # save list as comma string
    ])


# ---- Indicators ----
def fetch_indicators():
    """Fetch indicators (like Total Savings, Monthly Savings) from Sheet2."""
    ws = get_sheet("Sheet2")
    return ws.get_all_records()

def update_indicator(name: str, value):
    """Update an indicator in Sheet2 (find row by name and update value)."""
    ws = get_sheet("Sheet2")
    data = ws.get_all_records()

    for idx, row in enumerate(data, start=2):  # start=2 because row 1 is headers
        if row.get("Indicator") == name:
            ws.update_cell(idx, 2, value)  # column 2 = Value
            return True
    return False
