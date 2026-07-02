from fastapi import FastAPI

from app.database import engine
from app.models.base import Base
from app.models.document import Document

from app.routes.upload import router as upload_router
from app.routes.search import router as search_router
from app.models.document_chunk import DocumentChunk
from app.routes.analyze_diff import router as diff_router
from app.routes.github import router as github_router


app = FastAPI()

app.include_router(upload_router)
app.include_router(search_router)
app.include_router(diff_router)
app.include_router(github_router)
    
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {
        "message": "AI Regression Impact Analyzer API Running"
    }