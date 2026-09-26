@echo off
echo =======================================================
echo          NYAYASETU - GenAI Legal Platform
echo "Understand Your Legal Documents. Know Your Next Step."
echo =======================================================
echo.

echo [1/2] Starting NyayaSetu FastAPI Backend on http://localhost:8000 ...
start "NyayaSetu Backend" cmd /k "cd backend && python main.py"

timeout /t 2 >nul

echo [2/2] Starting NyayaSetu React Frontend on http://localhost:5173 ...
start "NyayaSetu Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo NyayaSetu is launching!
echo Backend:  http://localhost:8000/api/docs
echo Frontend: http://localhost:5173
echo =======================================================
