Caliber — IB Exam Prep Platform: Implementation Plan

 Context

 IB Diploma students preparing for May 2025 exams need more than PDF markschemes — they need guided understanding of how to approach questions step-by-step. This platform
 ingests past exam papers and markschemes for three subjects (Math AI HL, Economics HL, CS SL), serves them via a PDF viewer, and layers Claude AI on top to walk through
 solutions, tutor interactively, identify recurring exam patterns, and generate new practice questions.

 Important data constraints discovered:
 - Math AI HL is a new subject (first examined May 2021). No papers exist before 2021 — only 4 sessions in the main folder (2021-2022 May/Nov) + 2025 May in the exampack.
 - 2023-2024 papers are absent from both source directories. Only 2021-2022 and 2025 May are present.
 - Two source locations with different filename conventions must be unified (double vs. single underscore before TZ).
 - Economics HL TZ designation evolved over time: TZ1/TZ2 pre-2019, no TZ from 2021 onward.

 ---
 Tech Stack

 ┌────────────────┬────────────────────────────────────────────────────────────────┐
 │     Layer      │                             Choice                             │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ Framework      │ Next.js 14 (App Router, TypeScript)                            │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ Styling        │ Tailwind CSS + shadcn/ui                                       │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ AI             │ Anthropic Claude API (claude-sonnet-4-6) via @anthropic-ai/sdk │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ Database       │ SQLite via better-sqlite3 (simple, no server, portable)        │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ PDF Rendering  │ pdfjs-dist + react-pdf (browser-side, dynamic import)          │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ PDF Processing │ Python script (pypdf2/pdfplumber)                              │
 ├────────────────┼────────────────────────────────────────────────────────────────┤
 │ Streaming      │ Server-Sent Events (ReadableStream in Next.js route handlers)  │
 └────────────────┴────────────────────────────────────────────────────────────────┘

 ---
 Project Directory Structure

 /Users/anshul/Desktop/caliber/
 ├── package.json
 ├── next.config.ts
 ├── tsconfig.json
 ├── tailwind.config.ts
 ├── .env.local                         # ANTHROPIC_API_KEY, PDF_BASE_PATH
 │
 ├── scripts/
 │   ├── ingest_papers.py               # Walks PDF directories → populates SQLite
 │   ├── ingest_guides.py               # Chunks subject guide PDFs → guide_chunks table
 │   └── requirements.txt               # pypdf2 / pdfplumber, pathlib
 │
 ├── db/
 │   └── caliber.db                     # SQLite DB (gitignored)
 │
 ├── public/
 │   └── pdf.worker.min.js              # PDF.js worker (copied from pdfjs-dist)
 │
 └── src/
     ├── app/
     │   ├── layout.tsx                 # Root layout + NavBar
     │   ├── page.tsx                   # Home: subject hero cards + stats
     │   ├── papers/
     │   │   ├── page.tsx               # Paper browser with filters
     │   │   └── [paperId]/page.tsx     # Paper detail + PDF viewer
     │   ├── tutor/
     │   │   └── [paperId]/page.tsx     # AI Step Walker + chat tutor
     │   ├── patterns/
     │   │   ├── page.tsx               # Pattern explorer (subject tabs)
     │   │   └── [subject]/page.tsx     # Subject pattern detail + heatmap
     │   ├── generate/page.tsx          # Practice question generator
     │   └── api/
     │       ├── papers/route.ts        # GET with filters
     │       ├── papers/[paperId]/route.ts
     │       ├── pdf/[paperId]/route.ts # Streams PDF bytes securely
     │       ├── ai/step-walker/route.ts  # POST → SSE walkthrough
     │       ├── ai/tutor/route.ts        # POST → SSE chat
     │       ├── ai/patterns/route.ts     # POST → pattern analysis JSON
     │       └── ai/generate/route.ts     # POST → SSE question generation
     │
     ├── components/
     │   ├── layout/ (NavBar, SubjectBadge, SessionBreadcrumb)
     │   ├── papers/ (PaperBrowser, PaperCard, FilterPanel, PaperMetaBadges)
     │   ├── viewer/ (PDFViewer [dynamic], PDFPageNav, PDFLoadingSkeleton)
     │   ├── ai/ (StepWalker, StepCard, AITutorChat, ChatMessage, ChatInput, StreamingText)
     │   ├── patterns/ (PatternExplorer, TopicHeatmap, PatternCard, YearDistribution)
     │   └── generate/ (QuestionGenerator, GeneratedQuestion, TopicSelector)
     │
     ├── lib/
     │   ├── db/ (client.ts singleton, queries.ts typed fns, schema.sql)
     │   ├── ai/ (client.ts, prompts/{stepWalker,tutor,patternFinder,questionGenerator}.ts, streaming.ts)
     │   ├── pdf/ (resolver.ts: paperId→path, serve.ts: range-request handler)
     │   └── types.ts
     │
     └── hooks/ (useStreamingResponse, usePaperFilters, useChatHistory)

 ---
 Database Schema

 CREATE TABLE papers (
     id            INTEGER PRIMARY KEY AUTOINCREMENT,
     subject       TEXT NOT NULL,  -- 'math_ai_hl' | 'economics_hl' | 'cs_sl'
     year          INTEGER NOT NULL,
     session       TEXT NOT NULL,  -- 'may' | 'november'
     paper_number  INTEGER NOT NULL,
     timezone      TEXT,           -- 'TZ1' | 'TZ2' | 'TZ3' | NULL
     level         TEXT NOT NULL,  -- 'HL' | 'SL' | 'HLSL'
     language      TEXT NOT NULL DEFAULT 'English',
     is_markscheme INTEGER NOT NULL DEFAULT 0,
     source        TEXT NOT NULL,  -- 'main' | 'm25exampack'
     file_path     TEXT NOT NULL UNIQUE,
     display_name  TEXT NOT NULL
 );

 CREATE TABLE guide_chunks (
     id         INTEGER PRIMARY KEY AUTOINCREMENT,
     subject    TEXT NOT NULL,
     topic_area TEXT,
     chunk_seq  INTEGER NOT NULL,
     content    TEXT NOT NULL      -- ~1500 char chunks with overlap
 );

 CREATE TABLE patterns (
     id              INTEGER PRIMARY KEY AUTOINCREMENT,
     subject         TEXT NOT NULL,
     topic_area      TEXT NOT NULL,
     pattern_name    TEXT NOT NULL,
     description     TEXT NOT NULL,
     frequency_count INTEGER NOT NULL DEFAULT 0,
     years_seen      TEXT,   -- JSON array
     command_terms   TEXT,   -- JSON array
     mark_range      TEXT
 );

 CREATE TABLE pattern_paper_links (
     pattern_id INTEGER REFERENCES patterns(id),
     paper_id   INTEGER REFERENCES papers(id),
     question_ref TEXT,
     PRIMARY KEY (pattern_id, paper_id)
 );

 CREATE TABLE generated_questions (
     id            INTEGER PRIMARY KEY AUTOINCREMENT,
     subject       TEXT NOT NULL,
     topic_area    TEXT NOT NULL,
     difficulty    TEXT NOT NULL,
     question_text TEXT NOT NULL,
     model_answer  TEXT NOT NULL,
     mark_total    INTEGER,
     created_at    TEXT NOT NULL DEFAULT (datetime('now'))
 );

 ---
 Phase 1: Foundation — Paper Browser + PDF Viewer

 1.1 Project Scaffolding

 - npx create-next-app@latest . --typescript --tailwind --app (in /Users/anshul/Desktop/caliber/)
 - Install: @anthropic-ai/sdk, better-sqlite3, @types/better-sqlite3, pdfjs-dist, react-pdf
 - npx shadcn@latest init → add: button, card, badge, input, select, tabs, sheet, slider, skeleton, separator
 - next.config.ts: configure experimental.serverComponentsExternalPackages: ['better-sqlite3']

 1.2 Python Ingestion Script (scripts/ingest_papers.py)

 Source 1 — Main folder:
 - Base: /Users/anshul/Desktop/caliber/home/ptib/IB PAST PAPERS - SUBJECT/
 - Walk: Group 5 - Mathematics/Mathematics_applications_and_interpretation_HL/
 - Walk: Group 3 - Individuals and Societies/Economics_HL/
 - Walk: Group 4 - Sciences/Computer_science_SL/
 - Each session folder name → parse year + session (e.g., "2022 May Examination Session")
 - Each .pdf filename → parse subject, paper number, TZ, level, language, is_markscheme
 - Skip if filename contains French, Spanish, German, [German] → English only
 - Key parsing rule: main folder uses double underscore before TZ: paper_1__TZ1_HL.pdf
 - Store timezone = NULL when no TZ in filename (Economics post-2021, CS SL all years)

 Source 2 — m25exampack:
 - Base: /Users/anshul/Desktop/caliber/m25exampack 2/files and resources/
 - Walk: Mathematics/ → Math AI HL files (prefix Mathematics_applications_and_interpretation)
 - Walk: Individuals and societies/ → Economics HL files (prefix Economics)
 - Walk: Experimental sciences/ → CS SL files (prefix Computer_science)
 - Year = 2025, session = 'may', source = 'm25exampack'
 - Key parsing rule: m25exampack uses single underscore before TZ: paper_1_TZ1_HL.pdf
 - Includes TZ3 (not present in main folder)

 Deduplication: unique by file_path.

 Guide ingestion (scripts/ingest_guides.py):
 - Math AI HL: .../Mathematics Applications and Interpretation Guide 2021 - English.pdf
 - Economics HL: .../Economics Guide 2022 - English.pdf (use 2022, not 2013)
 - CS SL: .../Computer Science Guide 2014 - English.pdf
 - Chunk each PDF into ~1500-char segments with 200-char overlap
 - Classify each chunk into a topic area by keyword matching
 - Store in guide_chunks table for AI prompt injection

 1.3 PDF Serving API (/api/pdf/[paperId])

 - Resolve file_path from DB by paperId
 - Security: validate path starts with one of the two known base directories before reading
 - Stream bytes with Content-Type: application/pdf, support Range header for PDF.js
 - Never expose raw filesystem path to client

 1.4 Papers API (/api/papers)

 - GET /api/papers: filter by subject, year, session, timezone, paper, markscheme, paginate
 - GET /api/papers/[paperId]: full metadata + markscheme_id (paired markscheme's ID if found)

 1.5 Paper Browser UI

 - FilterPanel: subject checkboxes (3 subjects, color-coded), year range, session (May/Nov), TZ (TZ1/TZ2/TZ3/None), paper number, markscheme toggle
 - PaperCard: display_name, badges, "View Paper" + "View Markscheme" buttons
 - URL-synced filter state via usePaperFilters hook (shareable links)

 1.6 PDF Viewer Page (/papers/[paperId])

 - Left: full-height PDFViewer (dynamic import, SSR disabled)
   - Render one page at a time (memory-safe for large math PDFs)
   - Zoom controls, page nav, full-screen toggle
 - Right sidebar: paper metadata, "Open in Tutor" button, markscheme link

 ---
 Phase 2: AI Features — Step Walker + Tutor Chat

 2.1 Streaming Infrastructure

 - src/lib/ai/streaming.ts: shared SSE ReadableStream helper for all AI routes
 - useStreamingResponse hook: fetches SSE stream, accumulates text, exposes {text, isStreaming, error}

 2.2 Step Walker (/api/ai/step-walker + /tutor/[paperId])

 System prompt key elements:
 - IB marking conventions: M marks (method), A marks (accuracy), R marks (reasoning)
 - IB command term definitions: Calculate, Explain, Discuss, Sketch, State, Evaluate
 - Subject guide chunks injected at runtime (fetched from guide_chunks table)
 - Subject-specific rules (calculator policy, pseudocode syntax, diagram requirements)
 - Step format: STEP [n]: [Title]\n[Explanation]\nIB NOTE: [...]

 Subject rules:
 - Math AI HL: GDC allowed Paper 2+3, 3 sig figs convention, Voronoi bisector rules, z-score notation
 - Economics HL: Diagrams mandatory, Paper 3 quantitative formulas, "discuss" = definition+theory+diagram+example+evaluation+conclusion
 - CS SL: IB pseudocode syntax (not Python/Java), trace table format, UML conventions

 UI: Student types question number + pastes question text → streams step-by-step breakdown → each step appears progressively as StepCard

 2.3 Tutor Chat (/api/ai/tutor)

 - Full conversation history sent with each request (stateless, 200K context window)
 - System prompt: "Caliber" persona, subject + paper context, guide chunks, Socratic approach (guides before revealing)
 - AITutorChat: markdown rendering, "Suggest questions" meta-prompt, Cmd+K focus shortcut
 - "Ask follow-up" button in StepWalker pre-populates first tutor message with step context

 2.4 Tutor Page Layout (/tutor/[paperId])

 - Three-column desktop: collapsible PDF viewer | StepWalker (center) | AITutorChat (right)
 - Mobile: stacked with bottom sheet for chat

 ---
 Phase 3: Patterns + Question Generation

 3.1 Pattern Finder (/api/ai/patterns)

 - Input: subject + optional year range
 - Claude analyzes paper metadata + known IB syllabus knowledge
 - Returns structured JSON: [{pattern_name, topic_area, description, frequency_count, years_seen, command_terms, mark_range}]
 - Parse with Zod, upsert into patterns table
 - Second pass: link patterns to specific papers in pattern_paper_links

 Pre-identified patterns to seed/verify (Claude confirms frequency):

 Math AI HL: Regression + correlation coefficient interpretation, Normal distribution with inverse, Chi-squared goodness of fit / independence test, Voronoi diagrams
 (perpendicular bisectors), Compound interest / amortization tables, Paper 3 contextual investigation (Euler's method, population models)

 Economics HL: Supply/demand shifts + welfare triangles, PED calculation + revenue implication, AD/AS with macroeconomic objectives, Multiplier calculation (HL Paper 3),
 Monopoly vs. perfect competition diagram compare, Exchange rate causes + current account effect, Development indicators (HDI components + limitations)

 CS SL: Binary search trace table, Pseudocode writing (loops + conditionals), OOP class construction with inheritance, Linked list operations (add/remove/traverse), OSI/TCP-IP
 layer identification, Case study application (Paper 2)

 3.2 Pattern Explorer UI

 - TopicHeatmap: CSS grid — rows = topic areas, columns = years, cell intensity = frequency. No heavy chart library needed.
 - PatternCard: expand/collapse, "See example papers" → /papers?subject=...&year=..., "Generate practice question" → /generate?topic=...

 3.3 Question Generator (/api/ai/generate + /generate)

 - Input: subject, selected topics (IB syllabus-aligned list), difficulty (easy/medium/hard), optional pattern IDs
 - Guide chunks + pattern descriptions injected into system prompt
 - Output format delimited: ---QUESTION--- then ---MODEL ANSWER---
 - "Reveal Model Answer" button (hidden until student attempts)
 - "Open in Tutor" button passes generated Q as initial context
 - Saved to generated_questions table for reuse

 Difficulty mapping:
 - Easy: single command term, 4-6 marks, direct calculation or state/define
 - Medium: multi-part, 8-12 marks, mix of calculate + explain
 - Hard: 15-20 marks, full evaluate or investigate style (Paper 3 for Math AI)

 ---
 Critical Files to Read/Modify

 ┌─────────────────────────────────────┬──────────────────────────────────┐
 │                File                 │             Purpose              │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ scripts/ingest_papers.py            │ New file — PDF directory scanner │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ scripts/ingest_guides.py            │ New file — guide chunker         │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/lib/db/schema.sql               │ New file — DB schema reference   │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/lib/db/client.ts                │ New file — SQLite singleton      │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/lib/db/queries.ts               │ New file — typed query functions │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/lib/ai/prompts/stepWalker.ts    │ New file — core AI prompt        │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/lib/ai/prompts/tutor.ts         │ New file — tutor persona prompt  │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/app/api/pdf/[paperId]/route.ts  │ New file — secure PDF streaming  │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/components/viewer/PDFViewer.tsx │ New file — PDF.js wrapper        │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/components/ai/StepWalker.tsx    │ New file — step UI               │
 ├─────────────────────────────────────┼──────────────────────────────────┤
 │ src/components/ai/AITutorChat.tsx   │ New file — chat UI               │
 └─────────────────────────────────────┴──────────────────────────────────┘

 Reference source directories (read-only during build):
 - /Users/anshul/Desktop/caliber/home/ptib/IB PAST PAPERS - SUBJECT/Group 5 - Mathematics/Mathematics_applications_and_interpretation_HL/2022 May Examination Session/ — filename
  parsing validation
 - /Users/anshul/Desktop/caliber/m25exampack 2/files and resources/Mathematics/ — TZ3 + single-underscore parsing

 ---
 Verification Plan

 1. Ingestion: Run python scripts/ingest_papers.py → confirm ~18 Math AI HL English papers, ~50 Economics HL (2015+), ~26 CS SL (2015+) in DB. Spot-check 5 filenames parsed
 correctly.
 2. PDF Serving: curl http://localhost:3000/api/pdf/1 --output test.pdf → opens as valid PDF. Verify security: requesting an ID not in DB returns 404.
 3. Paper Browser: Filter to Math AI HL, 2022, May, TZ1 → see exactly 3 papers (Paper 1, 2, 3). Toggle markscheme → see 3 markschemes.
 4. Step Walker: Open Math AI HL Paper 1 TZ1 2022, type "Q4", paste a question → receive 4+ steps, each with IB NOTE.
 5. Tutor Chat: Send "I don't understand step 2" → tutor gives alternative explanation referencing IB conventions.
 6. Pattern Finder: Trigger for Economics HL → JSON response with 10+ patterns including "PED calculation" and "AD/AS diagram".
 7. Question Generator: Select Math AI HL + Statistics + hard → receive 15-20 mark question in IB format with model answer.