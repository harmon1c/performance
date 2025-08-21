## React Performance Task

This repository contains the implementation of the RS School React Performance task (CO2 Data Explorer).

### Status
Scaffold stage: old project (Pokemon) slated for removal; new Suspense data resource placeholder added.

### Planned Features (High Level)
- Load & parse large CO2 dataset (~100MB) with React Suspense fallback.
- Country list with required metrics (year, population, co2, co2_per_capita).
- Year selector, region filter, search, sorting (name/population).
- Dynamic additional columns via modal.
- Memoization & render optimization (useMemo, useCallback, React.memo).
- Profiling before & after optimizations (React DevTools Profiler screenshots & analysis).

### Profiling (Placeholders)
Will include: commit duration, render duration, interactions, flame graph, ranked chart comparisons.

### Run Locally
1. Install deps: npm install
2. Dev server: npm run dev
3. Tests (none yet): npm test

### Architecture (Preview)
See PERFORMANCE_PLAN.md for detailed staged plan & checklist.

### Notes
No UI component libraries will be used. TypeScript strict without any/ts-ignore.

---
Readme will expand with profiling results and optimization notes.