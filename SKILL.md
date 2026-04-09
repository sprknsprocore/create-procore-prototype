---
name: procore-prototype
description: Build Procore prototypes from plain-English descriptions. Handles project setup, page creation, multi-step flows, Figma import, and design audits — all without the user touching a terminal. Triggers on "prototype", "build me a page", "Procore UI", "mockup", "wireframe", "build a prototype", "create a page", "add a page", or when the user describes a Procore tool screen.
---

# Procore Prototype Kit

Build clickable, production-fidelity Procore prototypes from a description. The user says what they want; you handle everything — project setup, code, design tokens, and dev server.

## When to Use

- The user asks for a prototype, mockup, wireframe, or page that should look like Procore
- The user names a Procore tool (invoices, RFIs, submittals, budget, daily log, etc.)
- The user pastes a Figma URL and wants it turned into a working page
- The user says "build me a page", "create a prototype", "I need a screen for..."

## Step 1 — Check for an Existing Project

Before doing anything, check if the current workspace already has the prototype kit:

```bash
test -f package.json && grep -q '"procore-prototype-kit"' package.json 2>/dev/null && echo "EXISTS" || echo "MISSING"
```

**If EXISTS**: Skip to Step 3. The project is ready. Check if the dev server is running; if not, start it with `npm run dev`.

**If MISSING**: Continue to Step 2.

## Step 2 — Bootstrap the Project

Clone the prototype kit into the current directory. Do this silently — never show git output or ask the user to run commands.

```bash
git clone https://github.com/sprknsprocore/prototype-kit.git .prototype-kit-tmp
```

If the current directory is empty, move everything into it:

```bash
shopt -s dotglob
mv .prototype-kit-tmp/* .prototype-kit-tmp/.* . 2>/dev/null
rmdir .prototype-kit-tmp
```

If the current directory already has files (but is not the prototype kit), clone into a subdirectory instead:

```bash
mv .prototype-kit-tmp prototype-kit
cd prototype-kit
```

Then install and start:

```bash
npm install --loglevel=error
npm run dev
```

Tell the user: "Your prototype environment is ready. Now building what you asked for..."

Then continue to Step 3 immediately — don't stop and wait. Build what the user originally asked for in the same turn.

## Step 3 — Build What the User Asked For

Now that the project exists, read and follow the appropriate project-level skill:

| User's request | Skill to read |
|---|---|
| A single page (list, detail, form, dashboard) | `.cursor/skills/prototype-page/SKILL.md` |
| A multi-step flow or workflow | `.cursor/skills/prototype-flow/SKILL.md` |
| A Figma URL to implement | `.cursor/skills/figma-to-prototype/SKILL.md` |
| "Audit" or "fix the design" | `.cursor/skills/design-audit/SKILL.md` |

Read the skill file and follow its instructions. The project-level skills have detailed guidance for each scenario.

If the user's request doesn't clearly match a skill, default to `prototype-page` — most requests are for a single page.

### Context Gathering on Initial Requests

When the user asks for a **new** page or flow (not iterating on existing work), the delegated skill should run its **Discovery** step — asking 2–4 targeted questions about what they want to see, then proposing a plan for confirmation before building. This ensures the first build matches what the user has in mind.

Skip the discovery step when:
- The user is refining or iterating on an existing page
- The user provided a Figma URL (the design itself is the context)
- The user gave a detailed request that already covers columns, fields, actions, and statuses
- The user explicitly says "just build it" or indicates they want quick defaults

## Procore Design System (Quick Reference)

This section gives you enough context to plan pages while the project is bootstrapping. Once the project exists, the full design system is in `.cursor/rules/` and `reference/`.

### Page Structure

Every Procore page follows this layout:

```
Global Nav (52px, black) ← always present
Page Header (title + tabs + actions) ← always present
Content Area (gray background) ← main content in white cards
Dock (56px right sidebar) ← always present
Footer (68px, optional) ← for forms with Save/Cancel
```

### Shared Components

The `components/` directory has 34 production-ready components. Always import these — never rebuild from scratch:

- **GlobalNav** — Black 52px top navigation bar
- **PageHeader** — Title, icon, action buttons, tool-level tabs
- **StatusPill** — Five color variants: approved (green), inReview (yellow), notAccepted (red), open (blue), draft (gray)
- **Dock** — 56px right sidebar with icon buttons
- **Card** — White card wrapper for tables and detail sections
- **FormField** — Labeled input with required marker and error state
- **Icon** — Wrapper for `@procore/core-icons` (220+ icons)
- **Button**, **Modal**, **Pagination**, **Breadcrumbs**, **Tearsheet**, **Toast**, **Banner**, **Skeleton**, **FilterBar**, **DropdownMenu**, **Stepper**, **Checkbox**, **Radio**, **Switch**, **Avatar**, **Badge**, **Tooltip**

Import from `@/components/GlobalNav` or the barrel `@/components`.

### Styling

Use inline styles with CSS custom properties — never hardcode hex values:

```tsx
<div style={{ color: "var(--color-text-primary)", padding: "var(--spacing-lg)" }}>
```

Key token families:
- `--color-text-*` — primary, secondary, tinted (links), required (errors)
- `--color-background-*` — primary (white), secondary (gray), action-primary (orange)
- `--color-border-*` — default (inputs), separator (dividers)
- `--spacing-*` — sm (8px), md (12px), lg (16px), xl (24px), xxl (32px)
- `--shadow-*` — 1-center (cards), 1-bottom (headers), 4-center (modals)

### Typography

Font: Inter Tight (loaded from `public/assets/fonts/`). Never hardcode fontFamily.

| Style | Size | Weight |
|---|---|---|
| Page title | 24px | 700 |
| Section title | 20px | 600 |
| Body | 14px | 400 |
| Body emphasis | 14px | 600 |
| Small/caption | 12px | 400 |

### Icons

Import from `@procore/core-icons/dist` or use the `Icon` wrapper:

```tsx
import { Icon } from "@/components/icons";
<Icon name="Search" size={20} />
```

Common: Plus, Search, Filter, Cog, ChevronDown, EllipsisVertical, Pencil, Trash, Download, Bell, Info, Warning, Check, Clear

### Realistic Data

Always populate with construction industry data:
- **Vendors**: Summit Mechanical, Pacific Electric Co., Ironwork Solutions, Valley Concrete, Apex Plumbing
- **Projects**: Citywide Office Tower, Harbor Bridge Expansion, Riverside Medical Center
- **People**: Mike Chen, Sarah Patterson, James Rodriguez, Lisa Nakamura
- **Statuses**: Mix approved, pending, draft, rejected, open — never all the same

### Anti-Patterns (Never Do These)

- Hardcode hex colors — use `var(--color-*)` tokens
- Use arbitrary spacing — use `var(--spacing-*)` scale only
- Use emoji as icons — use `Icon` component or `@procore/core-icons`
- Use `<div onClick>` — use `<button>` or `<a>`
- Rebuild GlobalNav, StatusPill, or Dock from scratch — import them
- Show terminal output to the user — translate errors into plain language

## Communication Style

The people using this are designers and PMs, not engineers.

- Use plain language: say "page" not "component", "section" not "container"
- After every change, summarize in one sentence: "I added a search bar above the invoices table"
- Suggest 2-3 next steps as questions: "Want me to make the rows clickable?"
- Never ask the user to run commands, edit files, or install packages — just do it
- Never show raw error messages — fix problems silently or explain in plain English
- Be direct: "I built your invoices page" not "I've generated a component that renders an invoices list view"

## Session Continuity

- If prototype pages already exist, acknowledge them: "I can see you have an invoices page and an RFI page. What would you like to work on?"
- Never overwrite or delete existing pages unless the user explicitly asks
- Treat each message as an incremental change unless the user clearly asks for something new
- If the dev server is not running, start it automatically when making changes
