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

## Running it

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # Vitest — game rules run in Node, no browser needed
npm run typecheck
npm run lint
npm run build
```

No `.env` file is needed: nothing in the code reads an environment variable.

## Layout

| Folder | Holds | May depend on |
| --- | --- | --- |
| `src/core/` | loop, input, seeded RNG, simulation clock, event bus | nothing above it |
| `src/game/` | **all game rules, as plain numbers** | `core/`, `data/` |
| `src/data/` | save file, obstacle catalogue, character catalogue, strings | nothing |
| `src/render/` | Three.js scene, shapes, per-frame sync | `game/` (read-only) |
| `src/ui/` | React screens and the HUD | `game/`, `data/` |

`src/game/` may not import `three`, touch the DOM, or read the wall clock. That
boundary is enforced by lint, not by convention — it is what lets the whole rule set
be tested in Node, and it is why deterministic replay is possible at all. The
reasoning is in `docs/decisions/0002-tach-mo-phong-khoi-hien-thi.md`.

## Documentation

`docs/README.md` is the map. Read `docs/03-design/invariants.md` before changing any
code — it lists what breaks silently.
