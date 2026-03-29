from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- НОВЫЙ ИМПОРТ
from app.routers import items, clients, bookings, finance

app = FastAPI(title="Prokat System")

# --- ДОБАВЬ ЭТОТ БЛОК ---
# Настройка CORS
origins = [
    "http://localhost:5173", # Адрес твоего React-приложения
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Разрешаем все методы (GET, POST, PUT, DELETE)
    allow_headers=["*"], # Разрешаем все заголовки
)
# ------------------------

# Подключаем роутеры
app.include_router(items.router, prefix="/api/items", tags=["Items"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clients"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])

@app.get("/")
def read_root():
    return {"message": "Система Прокат работает!"}

#uvicorn app.main:app --reload