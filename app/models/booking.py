import enum
from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime, Numeric, Text, Enum, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    CONFLICT = "conflict"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=False, index=True)
    is_preorder = Column(Boolean, default=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    total_price = Column(Numeric(10, 2), nullable=True)
    
    item_id = Column(Integer, ForeignKey("items.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    
    item = relationship("Item", back_populates="bookings")
    client = relationship("Client", back_populates="bookings")

class Repair(Base):
    __tablename__ = "repairs"

    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(DateTime, default=func.now())
    predicted_end_date = Column(DateTime, nullable=True)
    actual_end_date = Column(DateTime, nullable=True)
    cost = Column(Numeric(10, 2), default=0)
    description = Column(Text)
    
    item_id = Column(Integer, ForeignKey("items.id"))
    item = relationship("Item", back_populates="repairs")