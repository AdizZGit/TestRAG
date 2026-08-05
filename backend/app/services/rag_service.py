def search_documents(changed_files):

    print("\nSearching Vector DB...")

    for file in changed_files:
        print(file["filename"])

    return [
        {
            "document": "API_TestCases.docx",
            "content": "Verify GitHub Pull API returns 200."
        }
    ]