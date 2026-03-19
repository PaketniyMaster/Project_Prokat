from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.item import ItemCreate, ItemResponse, CategoryCreate, CategoryResponse
from app.crud import crud_item

router = APIRouter()

# --- Роуты для Категорий ---
@router.post("/categories/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud_item.create_category(db=db, category=category)

@router.get("/categories/", response_model=List[CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_item.get_categories(db, skip=skip, limit=limit)

# --- Роуты для Товаров ---
@router.post("/items/", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return crud_item.create_item(db=db, item=item)

@router.get("/items/", response_model=List[ItemResponse])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_item.get_items(db, skip=skip, limit=limit)