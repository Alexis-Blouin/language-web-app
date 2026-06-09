# Chinese Reinforcement Learning App

A cool app where you can save chinese vocabulary and expressions, take notes and more!
I started this project to help me with my Chinese class. I didn't have any proper note taking application, so I created one.

## Features

- Save the words you learn with their pinyin and translation
- Organize them by chapters and categories
- Save more complete expressions if short words are not enough
- Take notes on some concepts, pattern, etc.
- Ask AI about the correctness of a text you wrote
- Some activities like word guessing and word attach
- Live pinyin input if you forget the pronunciation of an character

## Requirements

Before running the project, make sure you have Node.JS installed.
You can download it [here](https://nodejs.org/en/download)
Once it's installed, you have to install the dependencies for the backend and the frontend.

```PowerShell
cd backend
npm install
cd ..
cd frontend
npm install
```

<br />
For the database, I use MySQL.
I use MySQL Workbench for the ?, but you can use your own.
You can download it [here](https://dev.mysql.com/downloads/workbench/)

## Configuration

Once everything is downloaded, you first need to created a MySQL database and connect it to the project.
You will copy the backend/.env.example file and name it .env and fill your database information

<br />
For the JWT_SECRET variable, you can go to this [website](https://jwtsecrets.com/) and generate a JWS Token which is used in the account authentication process.

<br />
For the OPENAI_API_KEY and OPENAI_API_MODEL variable, you can use your own.
If you don't have one, you can go to [this](https://console.groq.com) page to select a model and get a key.

## Run the project

There is two batch files to run the project.
run-silent.vbs will start the services without opening any window.
run.vbs will start the Node.JS server in a terminal window, the React app in another one and will open a browser tab, useful for development.
kill.bat is to close any service running on port 3000 or 8081, useful to close the server after running run-silent.vbs

## Start on boot

It's also possible to start the project on the start of the computer.

1. Create a shortcut of the run-silent.vbs (or run.vbs if you want all the windows) file
2. Open the startup directory ("Windows Key + R" and type "shell:startup")
3. Move the shortcut here

## Note

This is a first version of the Readme, I will improve it.
Let me know if something is missing!
