# Mental Health Support Application

A comprehensive mental health support application featuring mood tracking, AI companion chat, daily inspiration, and self-help tools.

## Features

- **Mood Tracker**: Track your daily moods and add notes
- **AI Companion**: Chat with an AI companion for emotional support
- **Daily Inspiration**: 
  - Inspirational quotes
  - Mood-based song recommendations
  - Short stories for mindfulness and healing
- **Journal**: Write and save your thoughts
- **Meditation**: Simple breathing exercises
- **Resources**: Access to helpful mental health resources

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenAI API key

## Setup Instructions

1. **Clone or Download the Project**
   - Open Visual Studio Code
   - Clone this repository or copy all files to your desired location

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

4. **Running the Application**
   - Open the terminal in Visual Studio Code
   - Run the following command:
     ```bash
     npm start
     ```
   - Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
MentalHealthSupport/
├── server.js           # Express server and API endpoints
├── static/
│   ├── index.html     # Main HTML file
│   ├── styles.css     # Styles for the application
│   ├── script.js      # Client-side JavaScript
│   └── data.js        # Inspiration data (quotes, songs, stories)
├── package.json       # Project dependencies
└── .env              # Environment variables (create this)
```

## Using the Application

1. **Mood Tracking**
   - Select your current mood
   - Add optional notes
   - View your mood history

2. **AI Companion**
   - Type your message in the chat box
   - Receive supportive responses from the AI

3. **Daily Inspiration**
   - Read random inspirational quotes
   - Browse mood-based song recommendations
   - Read short stories categorized by theme

4. **Journal**
   - Write and save your thoughts
   - Review past entries

5. **Meditation**
   - Use the breathing exercise tool
   - Follow the visual guide for meditation

## Troubleshooting

1. **Server Won't Start**
   - Check if Node.js is installed: `node --version`
   - Ensure all dependencies are installed: `npm install`
   - Verify the port 3000 is not in use

2. **AI Chat Not Working**
   - Verify your OpenAI API key in the `.env` file
   - Check the browser console for errors
   - Ensure you have an active internet connection

3. **Static Files Not Loading**
   - Check if all files are in the correct directories
   - Clear your browser cache
   - Restart the server

## Additional Notes

- The application uses the OpenAI API for the AI companion feature
- All data is stored locally in your browser
- No sensitive information is transmitted to external servers (except AI chat)
