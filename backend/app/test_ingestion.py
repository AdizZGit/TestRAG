from app.services.ingestion_service import ingest_document

ingest_document(
    document_id=1,
    file_path="uploads/30_Day_Detailed_GenAI_Curriculum.docx",
    document_type="requirement",
    source_file="30_Day_Detailed_GenAI_Curriculum.docx"
)