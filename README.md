# Brompt: High-Efficiency Prompt Engineering Toolkit

<div align="center">
  <h3>Eliminate Prompt Fatigue. Build Better Prompts, Faster.</h3>
  <p>
    Brompt is an open-source, privacy-first web application designed to bridge the gap between prompt engineering theory and practical execution.
  </p>
  
  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## 🚀 Why Brompt?

Writing high-quality prompts for LLMs (Large Language Models) is often a friction-filled process. Users face "prompt fatigue"—the cognitive load of remembering complex frameworks, context requirements, and formatting rules.

**Brompt solves this by turning prompt creation into a conversation.**

Instead of staring at a blank text box, Brompt guides you through a dynamic, interactive questionnaire tailored to your specific goal. The result? A structured, high-performance "Mega-Prompt" generated in seconds.

### Core Philosophy

- **Simple by Default**: No complex settings to tweak upfront. Just type your goal and start.
- **Privacy First**: No backend database. Your API keys, history, and drafts live exclusively in your browser's `localStorage`.
- **Schema-Driven**: The UI adapts in real-time based on what the AI needs to know, powered by a flexible JSON schema engine.

## ✨ Key Features

- **Dynamic Form Engine**: The interface changes based on your answers. If you're writing code, it asks about languages; if you're writing a blog, it asks about tone and audience.
- **Iterative Refinement**: A multi-round "interview" process ensuring no detail is missed.
- **Local Persistence**: Auto-saving drafts and history management without sending data to a third-party server.
- **Client-Side AI**: Direct integration with Google Gemini, OpenAI, and Anthropic for fast, secure processing.
- **Multi-Language Support**: Built-in support for English and Portuguese (easily extensible).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Providers**: Google Gemini, OpenAI, Anthropic
- **State Management**: React Context + Hooks
- **Package Manager**: [pnpm](https://pnpm.io/)

## ⚡ How It Works

1.  **Seed**: You provide a high-level goal (e.g., "I want a Python script to parse CSV files").
2.  **Analyze**: Brompt uses an LLM to analyze your goal and determine missing information.
3.  **Refine**: The app generates a set of specific questions (using sliders, dropdowns, text inputs).
4.  **Iterate**: You answer the questions, and the cycle repeats until the prompt is perfect.
5.  **Generate**: Brompt compiles all context into a final, optimized prompt ready for use.

## 🏁 Getting Started

### Prerequisites

- Node.js (v20+)
- pnpm (`npm install -g pnpm`)
- An API Key (Google Gemini, OpenAI, or Anthropic)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/brompt.git
    cd brompt
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

4.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000).

5.  **Enter API Key**:
    On first launch, you'll be prompted to enter your API Key (Gemini, OpenAI, or Anthropic). This is stored locally in your browser.

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, adding new features, or improving documentation, your help is appreciated.

Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 Documentation

For more detailed information about the project structure and workflows, check out the `/docs` directory:

- [Architecture Overview](docs/architecture/overview.md)
- [User Workflow](docs/workflow/user-journey.md)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Henrique Nascimento. Powered by Open Source.</sub>
</div>
