from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.crud import crud_booking

router = APIRouter()

@router.post("/", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # 1. Проверяем доступность (Лабораторная 1.5 - диаграмма последовательности)
    is_available = crud_booking.check_availability(
        db, booking.item_id, booking.start_date, booking.end_date
    )
    
    if not is_available:
        raise HTTPException(
            status_code=400, 
            detail="Товар недоступен на выбранные даты (уже забронирован)"
        )
    
    # 2. Если свободно - создаем
    return crud_booking.create_booking(db, booking)