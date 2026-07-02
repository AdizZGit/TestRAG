from docling.document_converter import DocumentConverter

converter = DocumentConverter()


def parse_document(file_path: str):

    result = converter.convert(file_path)

    return result.document.export_to_markdown()