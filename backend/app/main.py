from fastapi import FastAPI

from app.database import engine
from app.models.base import Base
from app.models.document import Document

from app.routes.upload import router as upload_router
from app.routes.search import router as search_router
from app.models.document_chunk import DocumentChunk
from app.routes.analyze_diff import router as diff_router
from app.routes.github import router as github_router
from app.routes.report import router as report_router
from app.routes import analyze
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://test-rag-11.vercel.app",
        "https://test-rag-11-9kbauvzmz-aditya-r.vercel.app",
        # Current Vercel production domain
        "https://test-rag-nu.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(search_router)
app.include_router(report_router)
app.include_router(diff_router)
app.include_router(github_router)
app.include_router(analyze.router)
    
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {
        "message": "AI Regression Impact Analyzer API Running"
    }
