# Duskrun

An endless runner that looks into the sunset. Three lanes, one active skill, and a
rule that decides how everything is drawn: **what you must avoid is a silhouette,
what you want glows.**

Runs entirely in the browser. No backend, no accounts, no network calls.

## Features

- Three-lane run with jump and slide, playable with a keyboard or with swipes — neither is the fallback for the other
- Obstacle clusters drawn from a hand-written catalogue, every one of them proven passable by a solver that runs in CI
- Difficulty that scales with speed while keeping the player's reaction window constant
- Coins to pick up on the way
- Personal best kept on the device, plus a run-summary screen that leads straight back into the next run
- Dusk backlighting: obstacles carry no colour at all, so danger reads by brightness and survives every kind of colour blindness
- A charge meter filled by the coins you pick up, spending into one active skill per character — you choose the moment
- Three power-ups found on the road: magnet, shield, speed rush
- Four characters, each with its own skill and its own silhouette; prices set from a measured coin rate, not a guess
- Sound effects and a music bed, both synthesised in the browser — the repo ships no audio files
- Pause that actually stops the simulation clock, so timed effects stop with it
- Respects `prefers-reduced-motion`: decoration stops, the run itself does not

## Running it

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # Vitest — game rules run in Node, no browser needed
npm run typecheck
npm run lint
npm run build

# Re-measure the coin economy before changing any character price
npx vite-node scripts/measure-economy.ts
```

In a dev build, `window.__duskrun.stats()` reports fps, draw calls and live object
counts; `__duskrun.immortal()` and `__duskrun.warp(seconds)` exist so the densest
scene can be measured without dying to reach it. None of it ships in a production
build.

No `.env` file is needed: nothing in the code reads an environment variable.

## Layout

| Folder | Holds | May depend on |
| --- | --- | --- |
| `src/core/` | loop, input, seeded RNG, simulation clock, event bus | nothing above it |
| `src/game/` | **all game rules, as plain numbers** | `core/`, `data/` |
| `src/data/` | save file, obstacle catalogue, character catalogue, strings | nothing |
| `src/render/` | Three.js scene, shapes, per-frame sync | `game/` (read-only) |
| `src/audio/` | every sound, synthesised — no audio files | `data/` |
| `src/ui/` | React screens and the HUD | everything above |

`src/game/` may not import `three`, touch the DOM, or read the wall clock. That
boundary is enforced by lint, not by convention — it is what lets the whole rule set
be tested in Node, and it is why deterministic replay is possible at all. The
reasoning is in `docs/decisions/0002-tach-mo-phong-khoi-hien-thi.md`.

## Documentation

`docs/README.md` is the map. Read `docs/03-design/invariants.md` before changing any
code — it lists what breaks silently.

Measured performance figures, with the conditions they were measured under, are in
`docs/02-requirements/nfr.md`. Numbers there without a stated condition would not be
reproducible, so every one of them carries its own.
