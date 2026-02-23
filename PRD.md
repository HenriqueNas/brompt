# PRD - Brompt: High-Efficiency Prompt Engineering Toolkit

## Overview
**Brompt** is an open-source web application designed to maximize efficiency in creating high-quality "entry prompts." The project bridges the gap between prompt engineering techniques and practical execution by eliminating "prompt fatigue"—the cognitive load of remembering frameworks and the friction of manual writing.

Built with a dynamic, visual-first interface (powered by C1 by Thesys), Brompt transforms complex instruction building into a series of interactive choices (sliders, buttons, and toggles). The experience is **"Simple by Default,"** allowing any user to generate structured prompts in seconds. **Premium features** (future) will unlock an **"Advanced Mode,"** enabling fine-tuning of parameters and the definition of global "Default Rules."

**Business Value:**
- **Efficiency:** Drastic reduction in iteration time.
- **Quality:** High-performance LLM responses from the very first attempt.
- **Security & Privacy:** Local handling of API keys and open-source transparency.

---

## Scope (In / Out)

### In-Scope (MVP Features)
- **Dynamic Form Engine:** A logic-driven UI that generates interactive elements (buttons, toggles, sliders) based on JSON schemas managed by C1.
- **Fixed Prompt Configuration:** Global controls for Tone, Role/Agent, and Output Language.
- **Gemini Integration:** Input field for Google Gemini API Key and direct integration for testing.
- **Markdown Result Display:** Rendered Markdown view for prompt output.
- **Copy Mechanism:** One-click "Copy" button for raw Markdown text.
- **Local Persistence:** Secure local storage for API keys, form state (drafts), and prompt history.
- **Adaptive UI:** Responsive layout optimized for desktop and mobile web browsers.

### Out-of-Scope (Future Iterations)
- **PWA (Progressive Web App):** Standalone installation features.
- **Authentication:** Cloud-based user accounts or data syncing.
- **Native Mobile App:** Strictly focused on the web environment.
- **Social Layer:** No public prompt gallery or social sharing.

---

## Personas

### 1. The Individual Expert (Power User)
- **Profile:** Senior Engineers and AI Enthusiasts who understand frameworks but want to automate the repetitive "skeleton" of a prompt.
- **Pain Point:** The friction of manually typing out structured instructions repeatedly.

### 2. The Solo-Preneur / Tech Generalist
- **Profile:** Founders and Designers who need professional prompt standards without deep engineering study.
- **Pain Point:** Knowing a prompt needs "context" but lacking the mental energy to format it perfectly.

### 3. The Prompt Novice
- **Profile:** Users attempting technical tasks who are intimidated by the "blank text box."
- **Goal:** To use a guided, form-based approach to transform intent into a technical command.

---

## Functional Requirements

- **FR1: Dynamic Engine:** UI components must react to state changes with conditional logic (C1 Orchestration).
- **FR2: Global Config & i18n:** Support for English and Portuguese UI; settings for Role and Tone.
- **FR3: Gemini Integration:** Secure API Key management and a "Generate" button (No real-time preview to conserve resources).
- **FR4: Rendering:** Output must be rendered in Markdown with a copy-to-clipboard feature.
- **FR5: Search:** Sidebar search functionality limited to **Title terms only**.
- **FR6: Form Management:** "Reset Form" button with a mandatory confirmation dialog.
- **FR7: Single Page Architecture:** The entire app resides on a single route; settings managed via modals.

---

## Non-Functional Requirements

- **NFR1: Performance:** UI transitions and dynamic rendering under 100ms.
- **NFR2: Privacy:** Zero backend; data resides exclusively in LocalStorage.
- **NFR3: Scalability:** Schema-driven form structure to allow easy updates.
- **NFR4: Tech Stack:** React, TypeScript, Tailwind CSS, and C1 by Thesys.
- **NFR5: Feedback:** Component-level loading states for all asynchronous or state-heavy transitions.

---

## User Flow

1. **Setup:** User enters the SPA, opens the modal to set the Gemini API Key and selects UI language.
2. **Configuration:** User selects global "Role" and "Tone" from the header.
3. **Drafting:** User interacts with dynamic C1 components; system auto-generates a title (e.g., "[Role] - [Task]").
4. **Generation:** User clicks "Generate"; component-level loading states trigger; result is rendered in Markdown.
5. **Completion:** User copies the result; the session is auto-saved to the sidebar history.

---

## Success Metrics
*Omitted for personal productivity focus.*

---

## Attachments / Observations

- **Orchestration:** [C1 by Thesys](https://docs.thesys.dev/guides/how-c1-works)
- **Title Logic:** Auto-generated based on primary form selections to minimize user typing.
- **Future Backlog:** Advanced mode with global "System Rules" and custom user-defined schemas.
