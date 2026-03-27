from pydantic import BaseModel
from decimal import Decimal

class FinanceSummary(BaseModel):
    total_income: Decimal
    total_expenses: Decimal
    net_profit: Decimal