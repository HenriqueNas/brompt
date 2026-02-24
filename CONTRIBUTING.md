# Contributing to Brompt

Thank you for your interest in contributing to Brompt! We welcome contributions from everyone.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/brompt.git
    cd brompt
    ```
3.  **Install dependencies** using `pnpm`:
    ```bash
    pnpm install
    ```
    This project uses `pnpm` exclusively. If you don't have it installed, you can enable it via corepack:
    ```bash
    corepack enable
    ```

## Development Workflow

1.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Make your changes**.
3.  **Run checks** to ensure code quality:
    ```bash
    pnpm check
    ```
    This runs type checking and linting.
4.  **Commit your changes**.
    We use `husky` and `lint-staged` to automatically format and lint your code before committing.
    Please follow conventional commits if possible (e.g., `feat: add new button`, `fix: resolve crash`).

## Pull Requests

1.  **Push your branch** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
2.  **Open a Pull Request** against the `main` branch of the original repository.
3.  Fill out the **Pull Request Template** with details about your changes.

## Code Style

- We use **Prettier** for code formatting.
- We use **ESLint** for linting.
- We use **TypeScript** for type safety.

Configuration files:

- `.prettierrc`
- `.editorconfig`
- `tsconfig.json`

Happy coding!
