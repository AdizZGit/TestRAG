from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet


router = APIRouter()


class ReportRequest(BaseModel):

    pr_number: int
    agent_decision: dict
    files: list
    analysis: str



@router.post("/generate-report")
def generate_report(report: ReportRequest):

    file_path = (
        f"Regression_Report_PR_{report.pr_number}.pdf"
    )


    doc = SimpleDocTemplate(
        file_path
    )


    styles = getSampleStyleSheet()

    content = []


    # Title

    content.append(
        Paragraph(
            "AI Regression Impact Report",
            styles["Title"]
        )
    )


    content.append(
        Spacer(1,20)
    )


    # PR

    content.append(
        Paragraph(
            f"PR Number: {report.pr_number}",
            styles["Normal"]
        )
    )


    content.append(
        Spacer(1,10)
    )


    # Risk

    decision = report.agent_decision


    content.append(
        Paragraph(
            f"Risk Level: {decision.get('risk_level')}",
            styles["Normal"]
        )
    )


    content.append(
        Paragraph(
            f"Reason: {decision.get('risk_reason')}",
            styles["Normal"]
        )
    )


    content.append(
        Spacer(1,20)
    )


    # Testing Strategy

    content.append(
        Paragraph(
            "Testing Strategy",
            styles["Heading2"]
        )
    )


    for item in decision.get(
        "testing_strategy",
        []
    ):

        content.append(
            Paragraph(
                f"- {item}",
                styles["Normal"]
            )
        )


    content.append(
        Spacer(1,20)
    )


    # Priority Test Cases

    content.append(
        Paragraph(
            "Recommended Test Cases",
            styles["Heading2"]
        )
    )


    for test in decision.get(
        "priority_test_cases",
        []
    ):

        content.append(
            Paragraph(
                f"- {test}",
                styles["Normal"]
            )
        )


    content.append(
        Spacer(1,20)
    )


    # Changed Files

    content.append(
        Paragraph(
            "Changed Files",
            styles["Heading2"]
        )
    )


    for file in report.files:

        content.append(
            Paragraph(
                f"""
                {file['filename']}
                <br/>
                Status: {file['status']}
                <br/>
                Changes: +{file['additions']} 
                -{file['deletions']}
                """,
                styles["Normal"]
            )
        )

        content.append(
            Spacer(1,10)
        )


    doc.build(content)


    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=file_path
    )