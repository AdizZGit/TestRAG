import os

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.services.ingestion_service import ingest_document
from fastapi import HTTPException



router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/upload")
async def upload_document(
    category: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # -----------------------------
    # Duplicate Check
    # -----------------------------
    existing_document = (
        db.query(Document)
        .filter(
            Document.filename == file.filename,
            Document.document_category == category
        )
        .first()
    )
    print(f"Existing Document: {existing_document}")

    if existing_document:
        raise HTTPException(
            status_code=409,
            detail=f"'{file.filename}' already exists."
        )

    # -----------------------------
    # Save File
    # -----------------------------
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # -----------------------------
    # Save Metadata
    # -----------------------------
    new_document = Document(
        filename=file.filename,
        file_type=file.filename.split(".")[-1],
        file_path=file_path,
        document_category=category
    )

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    # -----------------------------
    # Ingest into Chroma
    # -----------------------------
    try:

        ingest_document(
            document_id=new_document.id,
            file_path=file_path,
            document_type=category,
            source_file=file.filename
        )

    except Exception as e:

        print(f"Ingestion Error: {e}")

        return {
            "success": False,
            "document_id": new_document.id,
            "error": str(e)
        }

    return {
        "success": True,
        "document_id": new_document.id,
        "filename": file.filename,
        "message": "File uploaded successfully"
    }

@router.get("/documents")
def get_documents(
    db: Session = Depends(get_db)
):

    documents = (
        db.query(Document)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "category": doc.document_category,
            "uploaded_at": doc.uploaded_at,
        }
        for doc in documents
    ]