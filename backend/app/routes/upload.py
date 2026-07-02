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


router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/upload")
async def upload_document(
    category: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    new_document = Document(
    filename=file.filename,
    file_type=file.filename.split(".")[-1],
    file_path=file_path,
    document_category=category
)

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

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
