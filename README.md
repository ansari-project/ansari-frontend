# ⚠️ FROZEN — `multisage` no longer deploys

As of 2026-09-22, production web (**askansari.ai** and **shura.ansari.chat**) builds from the
monorepo **[iaser-ai/ansari](https://github.com/iaser-ai/ansari)**, directory
[`legacy/frontend-web`](https://github.com/iaser-ai/ansari/tree/main/legacy/frontend-web)
(Railway service `frontend-legacy`, branch `main`).

`legacy/frontend-web` is a snapshot of this branch at `ad72bc6`. **Pushing or merging to
`multisage` does not deploy anything.** Send askansari.ai fixes as PRs against `develop` in
iaser-ai/ansari; they reach production when `main` is promoted.
