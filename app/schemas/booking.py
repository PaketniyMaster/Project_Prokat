from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.booking import BookingStatus

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

    class Config:
        from_attributes = True