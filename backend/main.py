from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import transactions, indicators

app = FastAPI()

# Enable CORS (React frontend needs this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(indicators.router, prefix="/indicators", tags=["Indicators"])

@app.get("/")
def root():
    return {"message": "Expense Tracker API running"}
