import enum
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric, Enum, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TransactionType(str, enum.Enum):
    INCOME_RENTAL = "income_rental"
    EXPENSE_PURCHASE = "expense_purchase"
    EXPENSE_REPAIR = "expense_repair"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    item_id = Column(Integer, ForeignKey("items.id"), nullable=True)
    item = relationship("Item", back_populates="transactions")