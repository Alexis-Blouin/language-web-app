batch
  @echo off
  cd backend
  start "Backend" npm start
  cd ..
  cd frontend
  start "Frontend" npm start
  exit