#!/usr/bin/env bash
# upgrade-cancel-flow.sh
set -Eeuo pipefail

########################################
#  0 — CLI flags
########################################
PROJECT_PATH="cancel-flow-demo"
PKG="npm" # npm|yarn|pnpm|bun

usage() {
  echo "Usage: $0 [--path ./myDir] [--npm|--yarn|--pnpm|--bun]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --path)  PROJECT_PATH="$2"; shift 2 ;;
    --npm|--yarn|--pnpm|--bun) PKG="${1/--/}"; shift ;;
    *) usage ;;
  esac
done

[[ -d "$PROJECT_PATH" ]] || {
  echo "❌  Cannot find folder: $PROJECT_PATH"; exit 1; }

cd "$PROJECT_PATH"
echo -e "\e[96m▶ Upgrading project at $(pwd)\e[0m"

########################################
#  1 — helpers per package‑manager
########################################
case "$PKG" in
  npm)   ADD="npm i -D"; ADDP="npm i"; RUN="npm run"; EXEC="npx";;
  yarn)  ADD="yarn add -D"; ADDP="yarn add"; RUN="yarn"; EXEC="yarn";;
  pnpm)  ADD="pnpm add -D"; ADDP="pnpm add"; RUN="pnpm"; EXEC="pnpm exec";;
  bun)   ADD="bun add -d"; ADDP="bun add"; RUN="bun run"; EXEC="bunx";;
esac

########################################
#  2 — ESLint + Prettier + Husky
########################################
echo -e "\e[92m➜  Lint / format toolchain\e[0m"
$ADD eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier husky lint-staged >/dev/null

cat > .eslintrc.cjs <<'EOF'
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  env: { browser: true, es2022: true, node: true },
};
EOF

echo '{ "singleQuote": true, "semi": false }' > .prettierrc

# lint-staged + husky
npx husky init >/dev/null 2>&1 || true
# create hook file explicitly (v9+)
cat > .husky/pre-commit <<'HOOK'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- lint-staged
HOOK
chmod +x .husky/pre-commit

jq '. + { "lint-staged": { "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"] } }' \
  package.json > package.tmp && mv package.tmp package.json

########################################
#  3 — Storybook
########################################
echo -e "\e[92m➜  Storybook\e[0m"
$EXEC storybook@latest init --type react-ts --quiet

########################################
#  4 — Testing stack
########################################
echo -e "\e[92m➜  Jest + RTL + Cypress\e[0m"
$ADD jest @testing-library/react @testing-library/jest-dom ts-jest vitest
$ADD cypress

cat > jest.config.js <<'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
EOF

mkdir -p src/CancelFlow/__tests__
cat > src/CancelFlow/__tests__/CancelFlow.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react'
import { CancelFlow } from '../CancelFlow/CancelFlow'

test('renders first question', () => {
  render(<CancelFlow />)
  expect(screen.getByText(/how did we fall short/i)).toBeInTheDocument()
})
EOF

########################################
#  5 — Lazy‑load CancelFlow + PWA
########################################
echo -e "\e[92m➜  Code‑split & PWA\e[0m"
$ADD vite-plugin-pwa

# patch src/App.tsx
sed -i.bak 's/import { CancelFlow }.*/const CancelFlow = React.lazy(() => import(".\/CancelFlow\/CancelFlow"));/' src/App.tsx
grep -q "Suspense" src/App.tsx || sed -i.bak '1s/^/import { Suspense } from "react";\n/' src/App.tsx
sed -i.bak 's/return (/return (<Suspense fallback={<p>Loading…<\/p>}>\n/' src/App.tsx
sed -i.bak 's/<\/div>$/<\/Suspense><\/div>/' src/App.tsx

# vite.config.ts tweak
$EXEC sed -i'' -e '/defineConfig/s/$/,/' -e '$i\
import { VitePWA } from "vite-plugin-pwa";
' vite.config.ts
$EXEC sed -i'' '/plugins:/a\    VitePWA({ registerType: "autoUpdate" }),' vite.config.ts

########################################
#  6 — XState machine scaffold
########################################
echo -e "\e[92m➜  XState machine\e[0m"
$ADD xstate @xstate/react
mkdir -p src/CancelFlow
cat > src/CancelFlow/cancelMachine.ts <<'EOF'
import { createMachine, assign } from 'xstate'
import { steps } from './steps'

type Ctx = { idx: number; feedback: Record<string, string> }

export const cancelMachine = createMachine<Ctx>({
  id: 'cancel',
  initial: 'question',
  context: { idx: 0, feedback: {} },
  states: {
    question: {
      on: {
        SELECT: {
          actions: assign({
            idx: (ctx, e) => steps[ctx.idx].transition(e.value, ctx.feedback),
            feedback: (ctx, e) => ({ ...ctx.feedback, [steps[ctx.idx].id]: e.value }),
          }),
          target: 'next',
        },
      },
    },
    next: { always: [{ cond: 'isFinal', target: 'final' }, { target: 'question' }] },
    final: { type: 'final' },
  },
}, {
  guards: { isFinal: ctx => steps[ctx.idx].kind === 'final' },
})
EOF

########################################
#  7 — Docker & compose
########################################
echo -e "\e[92m➜  Dockerfile\e[0m"
cat > Dockerfile <<'EOF'
# ---- build stage ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# ---- production stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat > docker-compose.yml <<'EOF'
version: "3.8"
services:
  web:
    build: .
    ports:
      - "8080:80"
EOF

########################################
#  8 — GitHub Actions CI
########################################
echo -e "\e[92m➜  GitHub Actions CI\e[0m"
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'EOF'
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm test --if-present
      - run: npm run build
EOF

########################################
#  9 — Dynamic port utility (dev script tweak)
########################################
PORT=5173
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do PORT=$((PORT+1)); done
jq --arg port "$PORT" '.scripts.dev="vite --port " + $port' \
  package.json > package.tmp && mv package.tmp package.json

########################################
# 10 — Finish
########################################
echo -e "\e[93m✓  Upgrade complete\e[0m"
echo -e "\e[96m▶  Lint:      $RUN lint  (eslint src --ext ts,tsx)\e[0m"
echo -e "\e[96m▶  Tests:     $RUN test\e[0m"
echo -e "\e[96m▶  Storybook: $RUN storybook\e[0m"
echo -e "\e[96m▶  Dev:       $RUN dev  (http://localhost:$PORT)\e[0m"

trap 'echo -e "\n\e[31mTerminated\e[0m"' INT
