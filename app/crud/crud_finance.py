from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.finance import Transaction, TransactionType

def get_financial_summary(db: Session):
    # Считаем все доходы
    income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.INCOME_RENTAL
    ).scalar() or 0

    # Считаем все расходы (закупка + ремонт)
    expense_repair = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.EXPENSE_REPAIR
    ).scalar() or 0
    
    expense_purchase = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.EXPENSE_PURCHASE
    ).scalar() or 0

    total_expenses = expense_repair + expense_purchase
    net_profit = income - total_expenses

    return {
        "total_income": income,
        "total_expenses": total_expenses,
        "net_profit": net_profit
    }