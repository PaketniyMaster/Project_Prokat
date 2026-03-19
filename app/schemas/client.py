from pydantic import BaseModel, EmailStr

class ClientBase(BaseModel):
    full_name: str
    phone: str
    email: EmailStr | None = None
    passport_data: str | None = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True