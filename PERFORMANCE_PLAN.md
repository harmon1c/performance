## React Performance Project Plan (Detailed)

### 0. Context & Goals
Build a CO2 Explorer aligned with RS School performance task requirements: fetch large OWID CO2 JSON (~100MB), Suspense fallback, country list + yearly table, year pick, region filter, search, sort (name/population), dynamic extra columns, with profiling before/after optimizations (useMemo/useCallback/React.memo). Strict TypeScript, no UI libs.

### 1. Milestone / Commit Breakdown
1. chore: purge old project scaffold
2. feat: data domain skeleton (types, constants, parse stub, resource with Suspense)
3. feat: base App layout + Suspense fallback + data preview
4. feat: redux slices (filtersSlice, columnsSlice) + store wiring
5. feat: real parseCo2 implementation (transform, compute latestYear, robust region derivation)
6. feat: derived hook useCo2Data (filtered -> searched -> sorted -> memo chain) + tests
7. feat: UI controls (YearSelector, RegionFilter, SearchBox, SortControls) + highlight logic
8. feat: country list & row/table (required columns) + N/A handling
9. feat: columns modal (extra column selection) + persistence (localStorage)
10. docs: profiling (before) – capture screenshots & metrics
11. perf: memo optimizations (useMemo/useCallback/React.memo) + key strategies
12. docs: profiling (after) – update comparisons
13. chore: error boundary + fallback UX + accessibility pass
14. test: expand coverage (slices, parsing, hook, components light)
15. perf: virtualization of outer CountryTable list; web worker parsing + IndexedDB SWR cache
16. docs: final README polish (architecture, decisions, trade-offs)

### 2. Data Model (current)
CountryData { code, name, iso_code?, years[], latestYear, region? }
YearRecordRaw has base metrics year, population, co2, co2_per_capita plus dynamic keys. Region is derived from continent name or ISO3→continent mapping.

### 3. State Shape
filtersSlice: { year: number|'all', region: 'all'|string, search: string, sort: { field: 'name'|'population'; direction: 'asc'|'desc' } }
columnsSlice: { required: ['year','population','co2','co2_per_capita'], extraSelected: string[] }

### 4. Memo Chain
rawCountries -> filtered(by region) -> searched (name includes) -> sorted (field/direction) -> projected columns
useMemo layers to ensure minimal recomputation.

### 5. Performance Strategy
- Suspense for initial data load.
- Split heavy parsing (later: worker / setTimeout chunking if needed).
- React.memo for CountryRow / CountryTable; memoize heavy children.
- Stable callbacks via useCallback for filter/search/sort/columns.
- useMemo for derived lists and selected columns.
- Key props: country code; row keys year.
- Virtualization: implemented for YearlyTable; outer list virtualization optional.

### 6. Profiling Procedure
Scenarios: initial mount, sorting (name and population/CO2 proxy), search, change year, toggle columns. Metrics: Commit Duration, Render Duration (top components), Interactions, Flame Graph, Ranked.
Documentation: put a brief description with screenshots into root README.md (required by RS task); detailed notes live in performance/README-PERF.md with images under performance/docs/perf/{baseline,after}.

### 7. Edge Cases
- Missing values -> 'N/A'.
- No population for selected year: fallback to nearest previous or show N/A.
- Countries with sparse data sets.
- Case-insensitive search.
- Sorting with N/A pushes to end (population sort).

### 8. Risks & Mitigations
- Large JSON blocking main thread -> later streaming/worker.
- Memory footprint -> store only parsed structure; avoid derived expansions per render.
- Time constraints -> outer list virtualization as optional milestone if needed for "after" gains.

### 9. Follow-Up (Post Mandatory Scope)
- Worker-based parser.
- Virtualized list (react-window) custom (allowed, not a UI lib).
- Column presets export/import.

### 10. Checklist Quick Reference (status)
[x] Purge scaffold
[x] Data skeleton
[x] Base Suspense App
[x] Slices/store (filters, columns) + Provider wiring
[x] Real parser (latestYear; region derivation)
[x] Derived hook (useCo2Data: filter/search/sort + available extra keys)
[x] Controls UI (Search, Year, Sort, Region)
[x] Country list & table (expandable per-country yearly table; N/A handling)
[x] Columns modal (select extra columns; wired to store, outside-click close)
[x] Profiling before (baseline) — screenshots added to README-PERF and docs/perf/baseline
[x] Optimizations (memoization, stable callbacks, React.memo); YearlyTable virtualization
[ ] Profiling after — repeat scenarios; add screenshots to docs/perf/after and brief summary to README
[x] Error boundary + basic a11y
[ ] Tests coverage (slices, hook, components)
[x] Outer list virtualization; worker-based parsing with IndexedDB cache (SWR)
[ ] Final README polish (include perf summary & links)

Notes:
- Labels: consolidated into utils/labels.ts and used in UI.
- Search backed by store (filters.search); derived list uses store filters.
- Region: derived from continent or ISO mapping; filter uses normalized names.

Next immediate step: 1) Capture the "after" profiling using current optimizations and document deltas; 2) If more gains are needed, implement outer list virtualization in CountryTable and re-profile.

Baseline profiling procedure (DevTools React Profiler):
- Record interactions for: initial mount, typing in Search, changing Year, switching Sort (name/population), opening Columns modal and toggling 3–5 columns.
- Capture commit and render durations for Home, CountryTable, CountryRow, YearlyTable.
- Save Flamegraph/Ranked screenshots for each interaction. Document notable hotspots.

After profiling procedure:
- Repeat the same scenarios after optimizations. Compare Commit/Render durations and call out the top improvements. Add a brief summary with screenshots to the unified root README.md.

---
This file evolves; update as tasks complete.
