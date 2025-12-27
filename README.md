# Prompt Improver

A modern, AI-powered application to analyze and improve your prompts using Google's Gemini API.

## Features

- 🎯 **Smart Prompt Analysis**: Get detailed feedback on prompt quality, difficulty level, strengths, and weaknesses
- 🎨 **Image Generation**: Generate images from your prompts using Gemini
- 🎤 **Voice Input**: Record prompts using speech-to-text transcription
- 📝 **Improvement Suggestions**: Receive actionable steps to enhance your prompts
- ✨ **Auto-Generated Improvements**: Get optimized versions of your prompts instantly
- 📚 **History Tracking**: Save and revisit past analyses
- 🎨 **Example Templates**: Pre-built prompts to get you started
- 📋 **Copy & Use**: Easily copy improved prompts or load them back into the editor
- 🌙 **Modern Dark Theme**: Beautiful, responsive UI with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-improver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

5. Enter your Gemini API key when prompted

## Usage

1. **Enter a Prompt**: Type or record your prompt in the input area
2. **Analyze**: Click "Analyze" or press Ctrl/Cmd+Enter
3. **Review**: See quality score, strengths, weaknesses, and suggestions
4. **Improve**: Use the auto-generated improved prompt
5. **Generate Images**: Switch to the Image tab to create visuals from your prompt
6. **Save**: Your analysis is automatically saved to history

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **State**: React Hooks + localStorage

## API Key

Your Gemini API key is stored securely in localStorage and never sent to any server except Google's Gemini API.

Get your free API key: https://aistudio.google.com/app/apikey

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
