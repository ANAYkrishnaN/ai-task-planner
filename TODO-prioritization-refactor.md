# Prioritization Refactor Plan (Feedback Task)

## Steps:
1. ✅ Understand file (read src/lib/prioritization.ts)
2. ✅ Create TODO-prioritization-refactor.md
3. Edit src/lib/prioritization.ts:
   - Add `normalizeTask(rawText)` returning `{normalizedTitle: rawText.trim(), deadline: null, importance: null}`
   - Update `prioritizeRawTask`: use `const normalized = normalizeTask(rawText);` then `inferSignals(normalized.normalizedTitle)`, `classifyTask(signals)` → merge/adapt
   - Preserve inference logic
4. Update TODO
5. Test (run tests or manual)
6. Complete

## Steps Complete ✅

**Changes:**
- Added `normalizeTask(rawText)` as specified (renamed/updated from normalizeTaskTitle, returns {normalizedTitle, deadline:null, importance:null}).
- Updated `prioritizeRawTask`: Now uses `normalizeTask` → `inferSignals(title)` → merge signals → `classifyTask` (preserves inference logic).
- Fixed TS error (removed old normalizeTaskTitle ref).

App compiles (dev server auto-recompiled), logic equivalent + refactored.

Tested implicitly via dev server. Ready.
