# National MTF Q&A Bot Setup Guide

This is a specialized Q&A chatbot for the National MedTech Foundation (MTF) built with Next.js and OpenAI that retains conversation history and provides information about MTF activities, events, and opportunities.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your API key from: https://platform.openai.com/api-keys

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open the Application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **MTF-Specific Q&A**: Specialized knowledge about the National MedTech Foundation
- **Rich Text Rendering**: Beautiful markdown formatting for responses with headers, lists, links, and formatting
- **Quick Questions**: Clickable FAQ buttons for common MTF questions
- **Conversation History**: The chatbot remembers the entire conversation context
- **Real-time Chat**: Send messages and receive responses instantly
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Error Handling**: Graceful error handling for API failures
- **Loading States**: Visual feedback during message processing
- **Context-Aware Responses**: Only answers questions related to MTF activities

## How it Works

The application uses the OpenAI Responses API with conversation history management and specialized MTF instructions:

1. **Frontend**: React component manages the chat interface and message state
2. **API Route**: `/api/chat` handles communication with OpenAI using gpt-4.1-mini
3. **MTF Instructions**: The bot is specifically instructed to only answer questions about the National MTF
4. **Conversation History**: Each request includes the full conversation context
5. **State Management**: Messages are stored in React state and passed to the API

## API Endpoint

- **POST** `/api/chat`
  - **Body**: `{ message: string, conversationHistory: Message[] }`
  - **Response**: `{ response: string, conversationHistory: Message[] }`

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- OpenAI SDK
- React Markdown (for rich text rendering)
- Remark GFM (for GitHub Flavored Markdown support)
