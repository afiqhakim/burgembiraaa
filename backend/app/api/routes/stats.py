from datetime import date

from fastapi import APIRouter

router = APIRouter(prefix="/stats", tags=["stats"])

LAUNCH_DATE = date(2025, 2, 15)


@router.get("/days-since-launch")
def days_since_launch():
    today = date.today()
    days = (today - LAUNCH_DATE).days
    return {
        "launch_date": LAUNCH_DATE.isoformat(),
        "today": today.isoformat(),
        "days_since_launch": max(days, 0),
    }
