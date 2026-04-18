# App Store Release Notes Guide

Release notes should be **concise, user-friendly, and focused on real-world value** — not technical implementation details.

## Template

```
We're always working to make Ansari a better Islamic AI assistant. Here's what's new in this update:

- [Primary improvement — the headline change users will notice or benefit from most]
- [Secondary improvement]
- [Additional improvements if applicable]

Enjoying Ansari? Leave us a review! Your feedback helps us make Ansari better for everyone.
Questions or suggestions? We'd love to hear from you at feedback@askansari.ai.
```

## Translation Table

| Technical Change | User-Friendly Description |
|------------------|---------------------------|
| Model upgrade / accuracy benchmark improvement | Smarter, more accurate answers |
| Latency reduction | Noticeably faster responses |
| Performance optimization | Smoother experience |
| Bug fixes | Improved reliability |
| UI/UX refinements | Easier to use |
| Framework upgrade (Expo, RN) | Stability and performance improvements |
| Security patches | Improved security |
| New feature | [Describe what it lets the user do] |

## Character Limits

| Platform | Limit | Notes |
|----------|-------|-------|
| iOS (App Store) | 4,000 chars | Full template with intro/outro |
| Google Play | 500 chars | Shortened — "What's new:" intro and brief outro |

Create two versions in `RELEASE_NOTES.md`:
- Full iOS version with complete intro and outro
- Shortened Google Play version that keeps full feature details but trims intro/outro

## Guidelines

1. Speak to end users, not developers
2. Emphasize value (accuracy, speed, reliability) not implementation
3. Keep it brief: 3–6 bullet points
4. Avoid technical jargon ("Fabric", "OTA", "Reanimated", version numbers of libraries)
5. Lead with the headline change — the thing users will feel most
6. Include call-to-action for reviews
7. End with contact/support address

## What NOT to Include

- Technical implementation details (framework versions, library names)
- Developer language ("refactored", "migrated", "API updates", "deprecation")
- Internal tooling / CI / build changes (Dockerfile, Node version, workflow files)
- Bug descriptions that could alarm users ("crash fix" → "improved reliability")
- Cost / business-side wins (save for investor updates, not user notes)
- Links to external benchmarks or blog posts (store formatting strips/mangles URLs)
  - For social posts and blog updates, links are fine; use the separate "long-form" copy

## Channel Mapping

Different audiences need different framings of the same release.

| Channel | Style |
|---------|-------|
| iOS App Store | Full template (see `RELEASE_NOTES.md`) |
| Google Play Store | Shortened template (see `RELEASE_NOTES.md`) |
| Social media (Twitter/X, LinkedIn) | Short, with emoji + benchmark links |
| Blog / website / newsletter | Long-form with context, links, and business wins |
| In-app changelog | Match iOS wording |

## File Location

Save release notes to: `RELEASE_NOTES.md` at repo root.
