---
'@rolling-dice-app/core': patch
---

Switch build to `moduleResolution: NodeNext` and add explicit `.js`
extensions to all relative imports / re-exports in source.

Previously `core` built with `moduleResolution: Bundler`, which produced
`dist/**/*.js` containing extensionless imports like
`export * from './types'`. Bundler-based consumers (Vite / Nuxt / webpack)
handle this fine, but Node's native ESM resolver is strict and throws
`ERR_UNSUPPORTED_DIR_IMPORT`, making the package unusable from a plain
Node runtime — including the backend (Fastify under `tsx` / `node`).

No public API changes. Consumers continue to write
`import { ... } from '@rolling-dice-app/core'` exactly as before; only the
internal dist resolution paths now satisfy the NodeNext spec.
