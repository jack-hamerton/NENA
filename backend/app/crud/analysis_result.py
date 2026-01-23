
from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult
from app.schemas.analysis_result import AnalysisResultCreate


def create_analysis_result(db: Session, analysis_result: AnalysisResultCreate, study_id: int) -> AnalysisResult:
    db_analysis_result = AnalysisResult(**analysis_result.dict(), study_id=study_id)
    db.add(db_analysis_result)
    db.commit()
    db.refresh(db_analysis_result)
    return db_analysis_result
