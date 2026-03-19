from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Создаем движок подключения
engine = create_engine(settings.DATABASE_URL)

# Фабрика сессий (через нее мы будем делать запросы)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для всех моделей
Base = declarative_base()

# Функция для получения сессии (будем использовать в API)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()