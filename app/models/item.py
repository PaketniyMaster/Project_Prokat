import enum
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class ItemStatus(str, enum.Enum):
    AVAILABLE = "available"
    RENTED = "rented"
    IN_REPAIR = "in_repair"
    LOST = "lost"

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    items = relationship("Item", back_populates="category")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    purchase_price = Column(Numeric(10, 2), nullable=False)
    rental_price = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(ItemStatus), default=ItemStatus.AVAILABLE)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="items")
    
    bookings = relationship("Booking", back_populates="item")
    repairs = relationship("Repair", back_populates="item")
    transactions = relationship("Transaction", back_populates="item")