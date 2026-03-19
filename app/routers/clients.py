from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.client import ClientCreate, ClientResponse
from app.crud import crud_client

router = APIRouter()

@router.post("/", response_model=ClientResponse)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    return crud_client.create_client(db, client)

@router.get("/", response_model=List[ClientResponse])
def read_clients(db: Session = Depends(get_db)):
    return crud_client.get_clients(db)