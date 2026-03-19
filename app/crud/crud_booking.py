from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.booking import Booking, BookingStatus
from app.schemas.booking import BookingCreate

def check_availability(db: Session, item_id: int, start_date, end_date):
    """
    Проверяет, есть ли пересечения дат для данного товара.
    Возвращает True, если свободно. False, если занято.
    """
    # Логика пересечения отрезков:
    # (StartA <= EndB) and (EndA >= StartB)
    overlapping_booking = db.query(Booking).filter(
        Booking.item_id == item_id,
        Booking.status != BookingStatus.CANCELLED, # Отмененные не считаем
        and_(
            Booking.start_date <= end_date,
            Booking.end_date >= start_date
        )
    ).first()
    
    if overlapping_booking:
        return False # Занято
    return True # Свободно

def create_booking(db: Session, booking: BookingCreate):
    # Создаем объект модели
    db_booking = Booking(
        item_id=booking.item_id,
        client_id=booking.client_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        status=BookingStatus.PENDING # Сначала статус "В ожидании"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking