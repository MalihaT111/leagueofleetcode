from fastapi import APIRouter


router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/match/{match_id}")
async def match_results():
    pass