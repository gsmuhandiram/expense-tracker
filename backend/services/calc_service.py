from datetime import datetime

def calculate_indicators(records):
    total_savings = sum(r["Amount"] for r in records if r["Type"] == "Savings")
    monthly_food = sum(r["Amount"] for r in records if "Food" in r["Categories"])
    
    # Example monthly savings (Aug 2025)
    month_str = datetime.today().strftime("%Y-%m")
    monthly_savings = sum(
        r["Amount"] for r in records 
        if r["Type"] == "Savings" and month_str in r["Date"]
    )
    
    return {
        "TotalSavings": total_savings,
        "MonthlySavings": monthly_savings,
        "MonthlyFood": monthly_food
    }