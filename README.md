# Copilot Clone - AI Assistant

A modern Microsoft Copilot clone built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This application integrates with Google's Gemini AI API to provide intelligent chat assistance with a beautiful, responsive design.

## ✨ Features

- 🤖 **AI-Powered Chat**: Integrated with Google Gemini AI for intelligent responses
- 🎨 **Modern UI**: Clean, responsive design inspired by Microsoft Copilot
- 🌙 **Dark Mode**: Seamless dark/light mode switching
- 💬 **Real-time Chat**: Smooth chat interface with message streaming
- 🔧 **Code Highlighting**: Syntax highlighting for code snippets
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI API
- **Icons**: Lucide React
- **Markdown**: React Markdown with syntax highlighting
- **Theme**: Next Themes for dark mode

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env.local` file

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint for chat
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── ChatInterface.tsx        # Main chat component
│   ├── Header.tsx              # Header component
│   ├── Sidebar.tsx             # Sidebar component
│   └── ThemeProvider.tsx       # Theme provider
└── types/
    └── chat.ts                 # TypeScript types
```

## 🎯 Usage

1. **Start a Conversation**: Type your message in the input field and press Enter or click the send button
2. **View Responses**: The AI will respond with helpful information, code snippets, or assistance
3. **Toggle Dark Mode**: Use the theme toggle in the header to switch between light and dark modes
4. **Mobile Navigation**: On mobile devices, use the menu button to access the sidebar

## 🔧 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind classes in components for design changes
- Customize the color scheme in CSS variables

### AI Configuration
- Adjust the Gemini model in `src/app/api/chat/route.ts`
- Modify system prompts or behavior as needed

### Features
- Add new chat features in `ChatInterface.tsx`
- Extend the sidebar with additional functionality
- Add more AI models or providers

**Built with ❤️ using Next.js and Google Gemini AI**
