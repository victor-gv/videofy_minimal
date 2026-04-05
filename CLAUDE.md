# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Videofy Minimal turns news articles into short videos for digital signage. It fetches content, generates a manuscript via LLM, matches visuals, produces TTS narration, and renders video through a CMS review flow. Requires OpenAI and ElevenLabs API keys in `.env`.

## Commands

```bash
# Install everything
uv sync && npm install

# Start dev (API on :8001, CMS on :3000)
make dev                # or: make dev HOTSPOT=1 for hotspot model

# Run tests
make test               # all (Python + CMS typecheck/build)
make test-api           # Python tests only (uv run pytest -q)
make test-cms           # CMS typecheck + build

# Run a single Python test
uv run pytest tests/test_pipeline_generate.py -k "test_name"

# Docker alternative
docker compose up --build
```

## Architecture

**Three-layer system**: CMS (Next.js UI) -> API (FastAPI) -> Project files on disk.

### Backend — `api/`

- **`factory.py`**: App bootstrap — wires together all services (`ProjectStore`, `LLMService`, `ElevenLabsService`, `AssetAnalysisService`, `ConfigResolver`, `PipelineService`) and creates the FastAPI app.
- **`api.py`**: REST routes under `/api/` — CRUD for projects, generate, process, file serving, uploads.
- **`pipeline.py`**: Core orchestration with two main flows:
  - `generate_manuscript()`: article -> LLM script lines -> asset analysis (descriptions, placements, hotspots) -> manuscript with segments and media mappings.
  - `process_manuscript()`: manuscript -> TTS audio per line -> timeline assembly -> concatenated narration -> `processed_manuscript.json`.
- **`config_resolver.py`**: Merges brand config (`brands/*.json`) with project-level overrides (`working/config.override.json`).
- **`project_store.py`**: All disk I/O for project directories under `projects/<projectId>/`.
- **`settings.py`**: Pydantic Settings from `.env`.
- **`llm_service.py`**: OpenAI wrapper for manuscript generation.
- **`tts_service.py`**: ElevenLabs wrapper + ffmpeg for audio.
- **`asset_analysis.py`**: Image/video analysis — descriptions, media-to-segment placement, hotspot detection.

### Frontend — npm workspaces

- **`cms/`** (`@videofy/cms`): Next.js app — the editor UI. Uses Ant Design, Zustand, React Query, Tailwind.
- **`player/`** (`@videofy/player`): Remotion-based video composition and preview.
- **`types/`** (`@videofy/types`): Shared TypeScript types (Zod schemas).

### Fetchers — `fetchers/`

Plugin system for content ingestion. Each fetcher has `fetcher.json` (field definitions) and `fetcher.py` (implementation). Included: `reuters`, `ap`, `web` (generic HTML for testing).

### Project data — `projects/<projectId>/`

Three-phase layout: `input/` (fetched article + media), `working/` (manuscript, config overrides, audio clips, uploads), `output/` (processed manuscript, rendered video).

### Brands — `brands/*.json`

Control prompts, models, voice, visual theme, intro/outro assets. Copy `default.json` to create a new brand.
