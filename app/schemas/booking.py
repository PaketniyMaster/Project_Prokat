from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal
from app.models.booking import BookingStatus
from app.models.item import ItemStatus

class BookingCreate(BaseModel):
    item_id: int
    client_id: int
    start_date: datetime
    end_date: datetime

class BookingResponse(BaseModel):
    id: int
    start_date: datetime
    end_date: datetime
    status: BookingStatus
    item_id: int
    client_id: int
    total_price: Optional[Decimal] = None

    class Config:
        from_attributes = True

class BookingReturn(BaseModel):
    item_status: ItemStatus = ItemStatus.AVAILABLE
    repair_description: Optional[str] = None # Заполняется, если статус IN_REPAIR