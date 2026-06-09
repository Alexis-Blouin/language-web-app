Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd backend && npm start", 1, False
WshShell.Run "cmd /c cd frontend && set BROWSER=true && npm start", 1, False