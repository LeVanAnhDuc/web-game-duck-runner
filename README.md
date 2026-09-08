# 🌇 Duck Runner — three lanes into the sunset, and one skill you choose the moment for

[![CI](https://github.com/LeVanAnhDuc/web-game-duck-runner/actions/workflows/ci.yml/badge.svg)](https://github.com/LeVanAnhDuc/web-game-duck-runner/actions/workflows/ci.yml)
[![Deploy](https://github.com/LeVanAnhDuc/web-game-duck-runner/actions/workflows/deploy.yml/badge.svg)](https://github.com/LeVanAnhDuc/web-game-duck-runner/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/LeVanAnhDuc/web-game-duck-runner?sort=semver)](https://github.com/LeVanAnhDuc/web-game-duck-runner/releases)

A three-lane endless runner, played entirely in the browser. No backend, no account,
no install — open the page and run. Your best distance, your coins and the ducks you
have unlocked live in that browser's `localStorage` and nowhere else.

One rule decides how everything is drawn: **what you must avoid is a silhouette, what
you want glows.** The camera looks into the setting sun, so obstacles carry no colour
at all — danger reads by brightness, which means it survives every kind of colour
blindness. The one silhouette with a rim light is you.

**Play**: https://levananhduc.github.io/web-game-duck-runner/

<!-- screenshot: pending first deploy -->
![Duck Runner gameplay](docs/assets/screenshot.png)

## Features

- **Three lanes, three actions.** Change lane, jump over what is low, duck under what
  is high — which is where the name comes from.
- **A charge meter, not a cooldown.** Coins you pick up fill it; when it is full you
  choose the moment to spend it. Coins go to your wallet either way, so using the
  most enjoyable mechanic in the game never costs you progress.
- **One active skill per duck, and they are not ranked against each other.** *Ram*
  smashes through when you are boxed in, *Slow* buys back reaction time when the
  speed has outrun you, *Fly* trades distance for a pass over everything. Equal cost,
  equal duration — so there is no best one, only a right one for the situation.
- **Three power-ups on the road**: magnet, shield, speed rush. Unlike a skill, you do
  not pick the moment — that is the whole distinction.
- **Obstacle clusters that are provably passable.** Every cluster is hand-written
  data, and a solver proves each one can be cleared by running the shipped rules, at
  both speed extremes. A cluster that cannot be cleared turns CI red instead of
  killing a player unfairly.
- **Difficulty that scales with speed while your reaction window stays constant.**
  Spacing is reaction time × current speed, never a fixed distance.
- **Four ducks, told apart by silhouette.** Backlighting hides colour and texture, so
  identity has to live in proportion and shape: broad, lean, crested, capped.
- **Sound with no audio files.** Every effect and the music bed are synthesised in the
  browser. The coin pickup rises in pitch across a streak, which a fixed set of files
  could not do.
- **Pause that stops the simulation clock**, so timed effects stop with it rather than
  expiring while you read a menu.
- **Respects `prefers-reduced-motion`**: decoration stops, the run does not.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Change lane | `←` `→` · `A` `D` | Swipe left / right |
| Jump | `↑` · `W` | Swipe up |
| Duck (slide) | `↓` · `S` | Swipe down |
| Use skill | `Space` | The button at the bottom right |
| Pause | `Esc` · `P` | The button at the top left |

Neither input is the fallback for the other: both go through one `InputIntent`, so the
rules never learn which one you used. The skill button is an exclusion zone for
gestures — tapping it cannot be read as a swipe, which would otherwise change your
lane every time you used a skill.

## Commands

```bash
npm ci
npm run dev          # http://localhost:5173
npm test             # Vitest — the game rules run in Node, no browser needed
npm run typecheck
npm run lint
npm run build

# Re-measure the coin economy before changing any character price
npx vite-node scripts/measure-economy.ts
```

There is no `.env` to copy: nothing in the code reads an environment variable. See
[`.env.example`](.env.example), which explains that in more detail than an empty file
could.

In a dev build, `window.__duckRunner.stats()` reports fps, draw calls and live object
counts; `__duckRunner.immortal()` and `__duckRunner.warp(seconds)` exist so the densest
scene can be measured without having to survive to it. None of that ships in a
production build.

## How it is put together

Vite · TypeScript · Three.js for the scene · React for the screens only · Vitest.
No audio library and no 3D model files — see the ADRs below for why each of those was
dropped rather than added.

| Folder | Holds | May depend on |
| --- | --- | --- |
| `src/core/` | loop, input, seeded RNG, simulation clock, event bus | nothing above it |
| `src/game/` | **all game rules, as plain numbers** | `core/`, `data/` |
| `src/data/` | save file, obstacle catalogue, duck catalogue, strings | nothing |
| `src/render/` | Three.js scene, shapes, per-frame sync | `game/` (read-only) |
| `src/audio/` | every sound, synthesised | `data/` |
| `src/ui/` | React screens and the HUD | everything above |

**`src/game/` may not import `three`, touch the DOM, or read the wall clock.** That
boundary is enforced by lint and by a grep in CI, not by convention — it is what lets
the entire rule set be tested in Node, and it is the reason deterministic replay is
possible at all: the same seed and the same input sequence produce the same run, which
catches more gameplay regressions than any other single test here.

Three decisions dropped things the plan had originally included, each for the same
reason — the art direction made them contribute nothing:

- [`ADR-0001`](docs/decisions/0001-dung-three-js-thay-phaser.md) chose Three.js over
  Phaser/PixiJS. Right for a side-view runner; wrong once the camera looks into depth,
  because faking perspective needs front-facing artwork the free 2D packs do not have.
- [`ADR-0007`](docs/decisions/0007-dung-hinh-khoi-thay-model-tai-ve.md) dropped the
  downloaded 3D models. Every object is painted one flat colour, so a model file
  contributes no texture, no palette and no surface detail that survives a silhouette.
- [`ADR-0008`](docs/decisions/0008-am-thanh-tong-hop-thay-file.md) dropped Howler and
  the audio files. A runner needs four short sounds and a pad, and an oscillator
  produces those exactly.

## Releases and versioning

Every push to `main` creates a GitHub Release by itself
([`release.yml`](.github/workflows/release.yml)) and deploys to
**<https://levananhduc.github.io/web-game-duck-runner/>**
([`deploy.yml`](.github/workflows/deploy.yml)). Pull requests run lint, tests, a
build, the ADR-0002 boundary check and an audit first
([`ci.yml`](.github/workflows/ci.yml)).

Pages has to be enabled **once per repository** before the first deploy can succeed —
`configure-pages` cannot do it for you, because `GITHUB_TOKEN` is not allowed to
create a Pages site:

```bash
gh api -X POST repos/LeVanAnhDuc/web-game-duck-runner/pages -f build_type=workflow
```

**The version comes from your commit subjects**, so they have to follow Conventional
Commits. The whole range since the previous tag is scanned, so one `feat:` anywhere in
a push is enough for a minor bump — the merge commit's own subject does not need a
prefix.

| In the range since the last tag | Bump |
| --- | --- |
| `feat:` | minor — `v0.4.0` → `v0.5.0` |
| `fix:` · `docs:` · `chore:` · `ci:` · `refactor:` · `test:` · `perf:` | patch — `v0.4.0` → `v0.4.1` |
| `feat!:` (any `type!:`) or a `BREAKING CHANGE` footer | see the 0.x rule below |

**The 0.x rule:** while the major version is `0`, a breaking change bumps the
**minor**, not the major. Nothing is stable before 1.0, and `1.0.0` is a claim about
completeness — so crossing to it takes an explicit marker rather than happening on its
own. The first release of this repo was `v0.1.0` for the same reason.

Three markers, honoured **only in the HEAD commit subject** — not in bodies, because
the bodies here run long and discuss releases, which would otherwise trigger them:

- `[release minor]` / `[release major]` — force a bigger bump. `[release major]` is
  the only way to reach `1.0.0`.
- `[skip release]` — no release for this push. For CI-only changes where a release
  would be noise. Never use it on a push that also carries a `feat:`, or you cancel
  that feature's release too.

Both scripts run locally against the real history, so a release can be previewed
before anyone relies on it:

```bash
bash .github/scripts/next-version.sh
GITHUB_REPOSITORY=LeVanAnhDuc/web-game-duck-runner bash .github/scripts/release-notes.sh v0.2.0 v0.1.0
```

## Documentation

[`docs/README.md`](docs/README.md) is the map, and the only file that talks about other
files. Read [`docs/03-design/invariants.md`](docs/03-design/invariants.md) before
changing any code — it lists the twelve things that break **silently**, where the code
still runs and the tests still pass.

Measured performance figures live in
[`docs/02-requirements/nfr.md`](docs/02-requirements/nfr.md), each with the conditions
it was measured under. A number without its conditions would not be reproducible, so
every one of them carries its own.
