@echo off
echo Starting Backend Server on http://localhost:8000...
cd d:\my art website\backend
if exist venv (
    call venv\Scripts\activate
)
python -m uvicorn app.main:app --reload --port 8000
pause
