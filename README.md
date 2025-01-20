# LLaMA Chat

A modern chat interface built with SvelteKit and Tailwind CSS that connects to various LLM models through the GROQ API.

## Live Demo

🚀 Try it out: [chat.ifsvivek.tech](https://chat.ifsvivek.tech/)

## Features

- 🤖 Multiple AI model support (LLaMA, Mixtral, Gemma)
- 💨 Fast and responsive UI with SvelteKit
- 🎨 Beautiful design using Tailwind CSS
- 💬 Real-time chat interface
- 🌙 Dark mode
- 🔄 Model switching on the fly

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm or pnpm

### Installation

1. Clone the repository:

```sh
git clone https://github.com/ifsvivek/chat.git
```

2. Install dependencies:

```sh
npm install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add your GROQ API key:

```sh
GROQ_API_KEY=your_api_key_here
```

4. Start the development server:

```sh
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GROQ API](https://console.groq.com/)
- [LangChain](https://js.langchain.com/)
