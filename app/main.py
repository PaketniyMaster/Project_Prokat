from fastapi import FastAPI
from app.routers import items, clients, bookings, finance # <--- Добавили импорты

app = FastAPI(title="Prokat System")

# Подключаем роутеры
app.include_router(items.router, prefix="/api/items", tags=["Items"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clients"]) # <--- Новый
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"]) # <--- Новый
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"]) # <--- Новый роутер
@app.get("/")
def read_root():
    return {"message": "Система Прокат работает!"}



#uvicorn app.main:app --reload