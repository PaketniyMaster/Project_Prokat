from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from app.models.item import ItemStatus

# --- Схемы для КАТЕГОРИЙ ---
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True  # Чтобы Pydantic понимал объекты SQLAlchemy

# --- Схемы для ТОВАРОВ ---
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    purchase_price: Decimal
    rental_price: Decimal
    status: ItemStatus = ItemStatus.AVAILABLE
    category_id: int

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    category: Optional[CategoryResponse] = None # Показываем категорию внутри товара

    class Config:
        from_attributes = True