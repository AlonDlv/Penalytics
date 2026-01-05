from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# --- CONFIGURATION ---
app = FastAPI()

# Allow your Frontend (React) to talk to this Backend
origins = [
    "http://localhost:5173", # Local React
    "https://penalytics.online", # Your Production Domain
    "https://www.penalytics.online"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection (Replace string below if testing locally without .env)
MONGO_DETAILS = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.penalytics # Database Name
user_collection = db.users

# Security Settings
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_for_local_only")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- MODELS (Data Structure) ---
class Log(BaseModel):
    date: datetime = Field(default_factory=datetime.now)
    mood: str
    activity_type: str  # e.g., "M", "P", "S"
    notes: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    password: str

class UserInDB(UserCreate):
    logs: List[Log] = []

# --- HELPER FUNCTIONS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await user_collection.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

# --- API ROUTES ---

@app.get("/")
def read_root():
    return {"message": "Penalytics API is running"}

@app.post("/register", status_code=201)
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(user.password)
    new_user = {"username": user.username, "password": hashed_password, "logs": []}
    await user_collection.insert_one(new_user)
    return {"message": "User created successfully"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/logs/add")
async def add_log(log: Log, current_user: dict = Depends(get_current_user)):
    # Adds a log entry specifically to the logged-in user's document
    await user_collection.update_one(
        {"_id": current_user["_id"]},
        {"$push": {"logs": log.dict()}}
    )
    return {"message": "Log added"}

@app.get("/logs/me")
async def get_my_logs(current_user: dict = Depends(get_current_user)):
    # Returns only the logs for the user currently logged in
    # Convert ObjectIds to strings if needed, but for now returning logs list
    return current_user.get("logs", [])