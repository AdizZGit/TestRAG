from sqlalchemy import Column, Integer, Text, ForeignKey

from app.models.base import Base

class DocumentChunk(Base):

    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True)

    document_id = Column(
        Integer,
        ForeignKey("documents.id")
    )

    chunk_index = Column(Integer)

    chunk_text = Column(Text)