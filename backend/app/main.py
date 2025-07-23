from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncpg
import os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Habilidade(BaseModel):
    nome: str
    idade: int
    habilidade: str

async def get_db_connection():
    try:
        conn = await asyncpg.connect(
            user=os.getenv("DB_USER", "admin"),
            password=os.getenv("DB_PASS", "adminpass"),
            database=os.getenv("DB_NAME", "mydb"),
            host="db"
        )
        return conn
    except Exception as e:
        print(f"Erro na conexão com o banco: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

@app.on_event("startup")
async def startup():
    try:
        conn = await get_db_connection()
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS habilidades (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                idade INTEGER NOT NULL,
                habilidade VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        await conn.close()
    except Exception as e:
        print(f"Erro na inicialização: {e}")

@app.get("/")
async def read_root():
    return {"message": "API está funcionando!"}

@app.post("/habilidades/")
async def criar_habilidade(habilidade: Habilidade):
    try:
        conn = await get_db_connection()
        await conn.execute(
            "INSERT INTO habilidades(nome, idade, habilidade) VALUES($1, $2, $3)",
            habilidade.nome, habilidade.idade, habilidade.habilidade
        )
        await conn.close()
        return {"message": "Habilidade cadastrada com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/habilidades/")
async def listar_habilidades():
    try:
        conn = await get_db_connection()
        habilidades = await conn.fetch("SELECT * FROM habilidades ORDER BY created_at DESC")
        await conn.close()
        return habilidades
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))