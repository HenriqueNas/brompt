# Brompt: High-Efficiency Prompt Engineering Toolkit

<div align="center">
  <h3>Eliminate Prompt Fatigue. Build Better Prompts, Faster.</h3>
  <p>
    Brompt is an open-source, privacy-first web application designed to bridge the gap between prompt engineering theory and practical execution. 
    <a href="https://henriquenas.github.io/brompt/">Check live demo here</a>
  </p>
  
</div>

---

## Why Brompt?

Writing high-quality prompts for LLMs (Large Language Models) is often a friction-filled process. Users face "prompt fatigue"—the cognitive load of remembering complex frameworks, context requirements, and formatting rules.

**Brompt solves this by turning prompt creation into a conversation.**

Instead of staring at a blank text box, Brompt guides you through a dynamic, interactive questionnaire tailored to your specific goal. The result? A structured, high-performance "Mega-Prompt" generated in seconds.

### Core Philosophy

- **Simple by Default**: No complex settings to tweak upfront. Just type your goal and start.
- **Privacy First**: No backend database. Your API keys, history, and drafts live exclusively in your browser's `localStorage`.
- **Schema-Driven**: The UI adapts in real-time based on what the AI needs to know, powered by a flexible JSON schema engine.

## Features

- **Privacy-First**: No backend server. All data stays in your browser's `localStorage`.
- **Multi-Provider Support**: Use your own API keys for OpenAI, Anthropic, Gemini, Mistral, or Groq.
- **Dynamic Form Engine**: The AI asks clarifying questions to refine your request.
- **History Management**: Save and resume past prompt engineering sessions.
- **Export Options**: Copy the final prompt or save it for later use.
- **Internationalization**: Support for English and Portuguese.
- **Dark Mode**: Fully supported via Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK
- **State Management**: React Context + Hooks
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/henriquenas/brompt.git
   cd brompt
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Brompt requires API keys to function. You can enter your keys directly in the application settings (gear icon).

- **Google Gemini**: Get a key from [Google AI Studio](https://aistudio.google.com/).
- **OpenAI**: Get a key from [OpenAI Platform](https://platform.openai.com/).
- **Anthropic**: Get a key from [Anthropic Console](https://console.anthropic.com/).
- **Mistral**: Get a key from [Mistral Platform](https://console.mistral.ai/).
- **Groq**: Get a key from [Groq Console](https://console.groq.com/).

Keys are stored encrypted in your browser's `localStorage` and are never sent to any server other than the respective AI provider.

### Security: API Key Encryption

- **Passphrase Setup**: When you first save an API key, you will be prompted to create a passphrase. The app uses AES‑GCM with PBKDF2 (Web Crypto API) to encrypt keys at rest.
- **Unlock Flow**: On subsequent visits, you must enter your passphrase to unlock your keys. The keys are decrypted in memory for the session only.
- **Reset**: If you forget your passphrase, use “Reset all keys” in the unlock modal to clear stored keys and set a new passphrase.
- **Multiple Providers**: Changing the passphrase re‑encrypts all provider keys atomically to keep them consistent.

## Contributing

We welcome contributions from the community! Whether it's fixing bugs, adding new features, or improving documentation, your help is appreciated.

Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 Documentation

For more detailed information about the project structure and workflows, check out the `/docs` directory:

- Architecture Overview: [docs/architecture-overview.md](docs/architecture-overview.md)
- User Workflow: [docs/user-journey-workflow.md](docs/user-journey-workflow.md)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Henrique Nascimento. Powered by Open Source.</sub>
</div>
