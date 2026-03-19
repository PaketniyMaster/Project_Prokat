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
    # Превращаем Pydantic модель в SQLAlchemy модель
    db_item = Item(**item.dict()) 
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Item).offset(skip).limit(limit).all()

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()