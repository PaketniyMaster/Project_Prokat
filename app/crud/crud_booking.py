
import math
from sqlalchemy.orm import Session
from app.models.finance import Transaction, TransactionType
from sqlalchemy import and_
from app.models.booking import Booking, BookingStatus
from app.schemas.booking import BookingCreate
from app.models.booking import Repair
from app.models.item import Item, ItemStatus

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
    # 1. Находим товар, чтобы узнать его цену
    item = db.query(Item).filter(Item.id == booking.item_id).first()
    if not item:
        raise ValueError("Товар не найден")

    # 2. Считаем длительность аренды в днях (минимум 1 день)
    duration = booking.end_date - booking.start_date
    days = math.ceil(duration.total_seconds() / 86400)
    days = max(1, days)
    
    # 3. Считаем предварительную стоимость
    calculated_price = item.rental_price * days

    # 4. Создаем бронь уже с заполненной ценой
    db_booking = Booking(
        item_id=booking.item_id,
        client_id=booking.client_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        status=BookingStatus.PENDING,
        total_price=calculated_price # <--- Теперь цена сохраняется сразу!
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings(db: Session, skip: int = 0, limit: int = 100):
    # Получаем все бронирования, отсортированные по ID по убыванию (новые сверху)
    return db.query(Booking).order_by(Booking.id.desc()).offset(skip).limit(limit).all()


def complete_booking(db: Session, booking_id: int, item_status: ItemStatus, repair_description: str = None):
    # 1. Находим бронирование
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise ValueError("Бронирование не найдено")
    if booking.status == BookingStatus.COMPLETED:
        raise ValueError("Бронирование уже завершено")

    # 2. Закрываем текущее бронирование
    booking.status = BookingStatus.COMPLETED

    # 3. Обновляем статус товара и СЧИТАЕМ ДЕНЬГИ
    item = db.query(Item).filter(Item.id == booking.item_id).first()
    if item:
        item.status = item_status
        
        # Высчитываем длительность аренды в днях (округляем вверх, минимум 1 день)
        duration = booking.end_date - booking.start_date
        days = math.ceil(duration.total_seconds() / 86400) # 86400 секунд в сутках
        days = max(1, days)
        
        # Записываем итоговую стоимость аренды
        booking.total_price = item.rental_price * days
        
        # Создаем финансовую транзакцию (ДОХОД)
        new_transaction = Transaction(
            amount=booking.total_price,
            type=TransactionType.INCOME_RENTAL,
            item_id=item.id
        )
        db.add(new_transaction)

    # 4. Обработка поломки или утери
    if item_status in [ItemStatus.IN_REPAIR, ItemStatus.LOST]:
        if item_status == ItemStatus.IN_REPAIR:
            new_repair = Repair(
                item_id=item.id,
                description=repair_description
            )
            db.add(new_repair)
        
        future_bookings = db.query(Booking).filter(
            Booking.item_id == item.id,
            Booking.status.in_([BookingStatus.PENDING, BookingStatus.ACTIVE]),
            Booking.id != booking_id
        ).all()

        for fb in future_bookings:
            fb.status = BookingStatus.CONFLICT

    db.commit()
    db.refresh(booking)
    return booking