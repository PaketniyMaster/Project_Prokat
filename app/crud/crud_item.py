import datetime
from app.models.item import ItemStatus
from app.models.booking import Repair
from app.models.finance import Transaction, TransactionType
from sqlalchemy.orm import Session
from app.models.item import Item, Category
from app.schemas.item import ItemCreate, CategoryCreate


# --- Логика для Категорий ---
def create_category(db: Session, category: CategoryCreate):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()

# --- Логика для Товаров ---
def create_item(db: Session, item: ItemCreate):
    db_item = Item(**item.dict()) 
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    # --- НОВОЕ: Фиксируем трату на закупку товара ---
    new_transaction = Transaction(
        amount=db_item.purchase_price,
        type=TransactionType.EXPENSE_PURCHASE,
        item_id=db_item.id
    )
    db.add(new_transaction)
    db.commit()
    # -----------------------------------------------

    return db_item

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Item).offset(skip).limit(limit).all()

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def finish_repair(db: Session, item_id: int, cost: float):
    # 1. Проверяем, существует ли товар и сломан ли он
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise ValueError("Товар не найден")
    if item.status != ItemStatus.IN_REPAIR:
        raise ValueError("Товар не находится в ремонте")

    # 2. Находим активную запись о ремонте (где нет даты окончания)
    repair = db.query(Repair).filter(
        Repair.item_id == item_id, 
        Repair.actual_end_date == None
    ).first()
    
    if repair:
        repair.actual_end_date = datetime.datetime.utcnow()
        repair.cost = cost

    # 3. Возвращаем товар в строй
    item.status = ItemStatus.AVAILABLE

    # 4. Фиксируем расход (минус в кассу)
    new_transaction = Transaction(
        amount=cost,
        type=TransactionType.EXPENSE_REPAIR,
        item_id=item.id
    )
    db.add(new_transaction)

    db.commit()
    db.refresh(item)
    return item