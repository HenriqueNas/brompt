# Brompt: High-Efficiency Prompt Engineering Toolkit

**Brompt** is an open-source web application designed to maximize efficiency in creating high-quality "entry prompts." It bridges the gap between prompt engineering techniques and practical execution by eliminating "prompt fatigue"—the cognitive load of remembering frameworks and the friction of manual writing.

Built with a dynamic, visual-first interface (powered by **C1 by Thesys**), Brompt transforms complex instruction building into a series of interactive choices. The experience is **"Simple by Default,"** allowing any user to generate structured prompts in seconds.

## Project Vision

- **Efficiency:** Drastic reduction in iteration time.
- **Quality:** High-performance LLM responses from the very first attempt.
- **Security & Privacy:** Local handling of API keys and open-source transparency.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React Framework)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Orchestration:** [C1 by Thesys](https://docs.thesys.dev/)
- **State Management:** React Context / Local State (SPA Architecture)

## Architecture

Brompt follows a **Single Page Application (SPA)** architecture within a Next.js environment.

- **Schema-Driven UI:** The core form engine is powered by C1, which dynamically renders UI components based on JSON schemas. This allows for rapid iteration on prompt structures without code changes.
- **Privacy-First:** All sensitive data (API keys, history) is stored exclusively in `localStorage`. The application communicates directly with the Gemini API from the client (or via a thin proxy for security if needed, but primarily client-side for privacy).
- **No Routing Libraries:** Navigation is handled via internal state management to provide a seamless, app-like experience without full page reloads.

## Installation & Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/brompt.git
    cd brompt
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Thesys API Key (if required for C1 orchestration):
    ```bash
    THESYS_API_KEY=your_thesys_api_key
    ```
    *Note: Gemini API keys are entered by the user in the UI and stored locally.*

4.  **Run the development server:**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon) for details on how to submit pull requests, report issues, and suggest improvements.

---

**License:** MIT
