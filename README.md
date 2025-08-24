## CO2 Explorer (React Performance Task)

Implementation of the RS School React Performance assignment. The app loads a large OWID CO2 dataset with Suspense and provides filtering, sorting, and extra columns with attention to performance.

### Features mapped to task
- Data loading via React Suspense with fallback UI.
- Countries list with latest values and per-country expandable yearly table.
- Required yearly columns: year, population, co2, co2_per_capita (N/A for missing).
- Modal to select additional columns from available yearly fields.
- Controls: Year selector (with brief highlight on change), Region filter, Search, Sort (name, population, CO2, CO2 per capita).
- Memoization: useMemo for derived data, React.memo for tables/rows, useCallback for handlers.
- Virtualized yearly table rendering.

### Advanced optimizations
- Virtualized outer Country list and inner Yearly table (windowed rendering).
- Web Worker for off-main-thread fetch + parse of OWID JSON.
- IndexedDB cache with stale-while-revalidate for instant warm loads.
- Stable callbacks (useCallback), memoized derived data (useMemo), and memoized rows (React.memo).

### Score checklist (self-check)
- [x] Fetch and display country data (name, latest population, ISO)
- [x] Yearly table with required columns (N/A for missing)
- [x] Modal for extra columns
- [x] Year selector with highlight when values change
- [x] Filter by region
- [x] Search by country name
- [x] Sort by population (selected year) and name (asc/desc)
- [x] useMemo/useCallback/React.memo applied
- [x] Suspense fallback UI in place

### Getting started
1) Install dependencies
	- `npm install`
2) Run dev server
	- `npm run dev`
3) Lint
	- `npm run lint`

### Profiling guide and notes
This app includes before/after profiling. Baseline screenshots are already captured; add your “after” screenshots to the same structure.

Cold vs warm loads (important)
- Warm load: IndexedDB cache returns parsed data instantly; background worker refreshes the cache. DevTools “Disable cache” does NOT clear IndexedDB.
- Cold load: Clear Application → Clear storage (IndexedDB) or open Incognito. You’ll see the loader until the worker finishes fetching/parsing.

How to capture a profile
1) Open React DevTools → Profiler.
2) Click “Reload and profile” for initial mount; or Start profiling and then perform an interaction (sort, search, etc.).
3) Stop profiling and save Flamegraph and Ranked screenshots.

Where to put images
- Baseline: `./performance/docs/perf/baseline/`
- After: `./performance/docs/perf/after/`

#### Baseline profiling (before optimizations)
Captured with React DevTools Profiler (one session per interaction):
- Initial mount: ![initial mount](./performance/docs/perf/baseline/initial_render.png)
- Sort by name: ![sort by name](./performance/docs/perf/baseline/sort_name.png)
- Sort by CO2: ![sort by CO2](./performance/docs/perf/baseline/sort_co2.png)
- Search: ![search](./performance/docs/perf/baseline/search.png)
- Year change: ![year](./performance/docs/perf/baseline/year.png)
- Columns toggle: ![columns](./performance/docs/perf/baseline/columns.png)

Each interaction also has a Ranked view (see the baseline folder).

#### After profiling (after optimizations)
Repeat the same scenarios and place screenshots in `./performance/docs/perf/after/`.

Suggested filenames:
- `initial_render.png`, `initial_render_ranked.png`
- `sort_name.png`, `sort_name_ranked.png`
- `sort_co2.png`, `sort_co2_ranked.png`
- `search.png`, `search_ranked.png`
- `year.png`, `year_ranked.png`
- `columns.png`, `columns_ranked.png`

Brief summary (to be updated after capture):
- Initial mount: cold ~10–15s for network/parse; render ~40–50ms; warm ~0.1s from IDB cache.
- Sorting/search/year change commit times reduced via memoization and virtualization.

### Tech
- Vite + React + TypeScript (strict)
- Redux Toolkit for filters/columns selection
- Tailwind for styling (no component libraries)
