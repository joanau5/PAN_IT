# Journaling Companion (PAN_IT)
A secure, private journaling web app that helps users build healthier journaling habits.  
The app provides daily prompts, saves entries locally for privacy, and generates insights, tags, and reflective questions using a local LLM via [Ollama](https://ollama.ai/).

## Design Documentation
Please use this link: [Design Document (PDF)](./Design%20Document.pdf) to access design doc or the pdf is also accessible/uploaded in this repo.

## Installation & Usage

### Prerequisites

- Node.js (v18 or newer)  
- npm (comes bundled with Node.js)  
- [Ollama](https://ollama.ai/) installed locally with a supported model (for example, `llama3`)  
- Git (to clone the repository)  
- A modern web browser (Chrome, Safari, etc)

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
2. Install dependencies
   ```bash
   npm install
4. Open three terminals
5. Terminal 1: Run Ollama with your model
   ```bash
   ollama run llama3
7. Terminal 2: Start the backend server (make sure to cd into backend folder)
   ```bash
   npm run server
9. Terminal 3: Start the frontend (make sure to cd into frontend folder)
    ```bash
   npm run dev
11. Open the app in your broswer using: http://localhost:5173
