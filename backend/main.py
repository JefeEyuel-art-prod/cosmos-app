from fastapi import FastAPI # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # pyright: ignore[reportMissingImports]
from datetime import datetime

app = FastAPI(title="Cosmos Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LCCLURequest(BaseModel):
    m1: str


@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Cosmos Backend",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/analyze")
def analyze(payload: LCCLURequest):
    m1 = payload.m1

    return {
        "m1": m1,
        "m2": [
            "Hypothèse M2a : cause technique locale",
            "Hypothèse M2b : architecture frontend/backend incomplète",
            "Hypothèse M2c : incohérence entre intention utilisateur et état réel du système"
        ],
        "m3": {
            "test": "cohérence sous extension",
            "conclusion": "Analyse générée correctement par le backend Cosmos.",
            "status": "HAQ_PARTIEL"
        }
    }
