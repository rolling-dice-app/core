# @rolling-dice-app/types

## 0.2.0

### Minor Changes

- 3a84155: Add `PlanLimits` type and `FREE_PLAN_LIMITS` constant to define per-account usage caps (characters, items, campaign records, attacks, features, custom spells, plus content length limits). Used by backend for enforcement and frontend for UX gating.

### Patch Changes

- 5abfb19: Add Prettier with shared config aligned to backend/frontend, plus `.editorconfig`. New `format` / `format:check` scripts; CI Release workflow now gates on `pnpm format:check`. No public API change.

## 0.1.0

### Minor Changes

- e6ab592: initial release: extract shared persistent types from frontend (character / combat / dnd / spell)
