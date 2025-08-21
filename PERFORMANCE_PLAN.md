## React Performance Project Plan (Detailed)

### 0. Context & Goals
Build a CO2 Data Explorer meeting RS School performance task requirements: large JSON fetch (~100MB), filtering, search, sorting, dynamic columns, Suspense + profiling before/after optimizations (memo, callbacks, React.memo). Strict TypeScript, no UI libs.

### 1. Milestone / Commit Breakdown
1. chore: purge old project scaffold
2. feat: data domain skeleton (types, constants, parse stub, resource with Suspense)
3. feat: base App layout + Suspense fallback + data preview
4. feat: redux slices (filtersSlice, columnsSlice) + store wiring
5. feat: real parseCo2 implementation (transform, compute latestYear, region derivation)
6. feat: derived hook useCo2Data (filtered -> searched -> sorted -> memo chain) + tests
7. feat: UI controls (YearSelector, RegionFilter, SearchBox, SortControls) + highlight logic
8. feat: country list & row/table (required columns) + N/A handling
9. feat: columns modal (extra column selection) + persistence (localStorage)
10. docs: profiling (before) – capture screenshots & metrics
11. perf: memo optimizations (useMemo/useCallback/React.memo) + key strategies
12. docs: profiling (after) – update comparisons
13. chore: error boundary + fallback UX + accessibility pass
14. test: expand coverage (slices, parsing, hook, components light)
15. perf(optional): web worker or streaming parse / virtualization (if time)
16. docs: final README polish (architecture, decisions, trade-offs)

### 2. Data Model (initial)
CountryData { code, name, iso_code?, years[], latestYear }
YearRecordRaw has base metrics year, population, co2, co2_per_capita plus dynamic keys.

### 3. State Shape
filtersSlice: { year: number, region: 'all'|string, search: string, sort: { field: 'name'|'population'; direction: 'asc'|'desc' } }
columnsSlice: { required: ['year','population','co2','co2_per_capita'], extraSelected: string[] }

### 4. Memo Chain
rawCountries -> filtered(by region) -> searched (name includes) -> sorted (field/direction) -> projected columns
useMemo layers to ensure minimal recomputation.

### 5. Performance Strategy
- Suspense for initial data load.
- Split heavy parsing (later: worker / setTimeout chunking if needed).
- React.memo for CountryRow / CountryTable.
- Stable callbacks via useCallback for filter/search/sort/columns.
- Key props: country code; row keys year.
- Optional virtualization (windowing) for large lists (deferred).

### 6. Profiling Procedure
Scenarios: change year, search term, region filter, sorting, adding/removing columns.
Metrics: Commit Duration, Render Duration (top components), Interactions count, Flame Graph, Ranked Chart.
Before: minimal memoization disabled (baseline). After: full optimizations.

### 7. Edge Cases
- Missing values -> 'N/A'.
- No population for selected year: fallback to nearest previous or show N/A.
- Countries with sparse data sets.
- Case-insensitive search.
- Sorting with N/A pushes to end (population sort).

### 8. Risks & Mitigations
- Large JSON blocking main thread -> later streaming/worker.
- Memory footprint -> store only parsed structure; avoid derived expansions per render.
- Time constraints -> virtualization optional milestone.

### 9. Follow-Up (Post Mandatory Scope)
- Worker-based parser.
- Virtualized list (react-window) custom (allowed, not a UI lib).
- Column presets export/import.

### 10. Checklist Quick Reference
[ ] Purge scaffold
[ ] Data skeleton
[ ] Base Suspense App
[ ] Slices/store
[ ] Real parser
[ ] Derived hook
[ ] Controls UI
[ ] Country list & table
[ ] Columns modal
[ ] Profiling before
[ ] Optimizations
[ ] Profiling after
[ ] Error boundary + a11y
[ ] Tests coverage
[ ] (Optional) virtualization/worker
[ ] Final README

---
This file evolves; update as tasks complete.
