from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.finance import FinanceSummary
from app.crud import crud_finance

router = APIRouter()

@router.get("/summary/", response_model=FinanceSummary)
def get_finance_summary(db: Session = Depends(get_db)):
    return crud_finance.get_financial_summary(db)