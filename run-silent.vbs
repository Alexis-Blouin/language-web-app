Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd backend && npm start", 0, False
WshShell.Run "cmd /c cd frontend && npm start", 0, False