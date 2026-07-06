# Playwright AI Agents (Cursor)

Fresh project to try Playwright's **Planner → Generator → Healer** pipeline in **Cursor**.

## 1. Install dependencies

```powershell
cd C:\Users\pawar\OneDrive\Desktop\playwright-ai-agents
npm install
npx playwright install chromium
```

## 2. Set your app URL

Copy `.env.example` to `.env` and set your target app:

```env
APP_BASE_URL=https://your-app.example.com
APP_USERNAME=your-user    # optional, if login needed
APP_PASSWORD=your-pass    # optional
```

Customize `tests/seed.spec.ts` and `tests/helpers/app.ts` if your login flow differs.

## 3. Enable MCP in Cursor

This project includes `.cursor/mcp.json` with the **playwright-test** server.

1. Open this folder in Cursor
2. Go to **Cursor Settings → MCP**
3. Confirm `playwright-test` is enabled (green)
4. Restart Cursor if it was just added

> You need `playwright-test` (`npx playwright run-test-mcp-server`), not only the general `@playwright/mcp` browser server.

## 4. Try the agents (Agent mode)

### Planner — create a test plan

```
@.github/agents/playwright-test-planner.agent.md
@tests/seed.spec.ts

Explore the homepage after seed setup. Create a smoke test plan for main navigation and key user flows.
Save to specs/smoke.md
```

### Generator — write tests from the plan

```
@.github/agents/playwright-test-generator.agent.md
@specs/smoke.md
@tests/seed.spec.ts

Generate Playwright tests from this plan. Save under tests/generated/
```

### Healer — fix failures

```
@.github/agents/playwright-test-healer.agent.md

Run the test suite and fix any failing tests.
```

### Full loop

```
1. Planner: explore app → specs/smoke.md
2. Generator: specs/smoke.md → tests/generated/
3. Run: npx playwright test
4. Healer: fix failures
```

## Project layout

```
playwright-ai-agents/
├── .cursor/
│   ├── mcp.json              # playwright-test MCP for Cursor
│   └── rules/                # Cursor rules for each agent
├── .github/agents/           # Official Playwright agent definitions
├── specs/                    # Markdown test plans (Planner output)
├── tests/
│   ├── seed.spec.ts          # Bootstrap (login, env setup)
│   ├── helpers/app.ts        # Shared navigation/login helpers
│   └── generated/            # Generated tests (Generator output)
├── playwright.config.ts
└── .env                      # Your app URL (not committed)
```

## Manual test run

```powershell
npm test
npm run test:headed
npm run report
```
