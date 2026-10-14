-- =============================================================================
-- TH Learning Lab — Phase 2, migration 1: core content schema
--
-- Mirrors the platform's code registries (subjects, simulations, GLE, learning
-- paths, quiz banks, MPT + teacher exams, cross-subject links) as relational
-- data, WITHOUT changing how the learner app reads content today.
--
-- Conventions
--   * Content rows carry `content_hash` (hash of the row's current content) and
--     `source_hash` (hash of the registry version last imported). When they are
--     equal the row is untouched since import; when they differ an admin edited
--     it, and the importer will never overwrite it.
--   * Deleting content = archiving (status), so FKs are RESTRICT except for rows
--     a parent fully owns (nodes, items, sections), which CASCADE.
--   * Simulation React code and routes stay in the repository; the database only
--     holds metadata and serialisable content.
-- =============================================================================

create type public.publish_status as enum ('draft', 'in_review', 'published', 'archived');

-- Provenance (where a question came from) is deliberately separate from
-- answer_check (how far its answer has been checked). A generated question can
-- never be a verified past paper: see constraints on public.questions.
create type public.question_source as enum (
  'verified_past_paper', 'existing_bank', 'generated', 'platform_authored'
);
create type public.answer_check as enum (
  'unchecked', 'self_checked', 'recomputed', 'independently_checked'
);
create type public.admin_role as enum (
  'super_admin', 'content_manager', 'question_manager', 'analyst'
);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------- admins ----
create table public.admin_roles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       public.admin_role not null,
  granted_by uuid,
  granted_at timestamptz not null default now()
);

-- --------------------------------------------------------------- subjects ---
create table public.subjects (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  code         text not null,
  name         text not null,
  tagline      text not null,
  description  text not null,
  notation     text not null default '',
  sort_order   integer not null,
  status       public.publish_status not null default 'published',
  content_hash text not null,
  source_hash  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.topics (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references public.subjects (id) on delete restrict,
  slug         text not null,
  name         text not null,
  sort_order   integer not null,
  status       public.publish_status not null default 'published',
  content_hash text not null,
  source_hash  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (subject_id, slug)
);

-- A simulation is the central learning entity. `href` ties it to a route that
-- exists in code; `content_slug` is the key used by GLE content and learner
-- progress (it differs from `slug` for three Mathematics simulations).
create table public.simulations (
  id           uuid primary key default gen_random_uuid(),
  subject_id   uuid not null references public.subjects (id) on delete restrict,
  topic_id     uuid not null references public.topics (id) on delete restrict,
  slug         text not null,
  content_slug text not null,
  title        text not null,
  description  text not null,
  href         text not null unique,
  sort_order   integer not null,
  status       public.publish_status not null default 'published',
  content_hash text not null,
  source_hash  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (subject_id, slug)
);
create index simulations_topic_idx on public.simulations (topic_id, sort_order);

-- Learning-experience (GLE) text/config. Only the serialisable part lives here;
-- inline diagrams (React nodes) and interactive verifiers stay in code, and the
-- JSON paths that were left out are recorded in `dropped_paths`.
create table public.gle_topics (
  id             uuid primary key default gen_random_uuid(),
  simulation_id  uuid not null unique references public.simulations (id) on delete restrict,
  content        jsonb not null,
  dropped_paths  text[] not null default '{}',
  schema_version integer not null default 1,
  status         public.publish_status not null default 'published',
  content_hash   text not null,
  source_hash    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ----------------------------------------------------------- learning paths -
create table public.learning_paths (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  subject_id   uuid not null references public.subjects (id) on delete restrict,
  title        text not null,
  description  text not null,
  color_token  text not null,
  status       public.publish_status not null default 'published',
  content_hash text not null,
  source_hash  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.learning_path_nodes (
  id            uuid primary key default gen_random_uuid(),
  path_id       uuid not null references public.learning_paths (id) on delete cascade,
  position      integer not null,
  subject_slug  text not null,
  topic_slug    text not null,
  simulation_id uuid references public.simulations (id) on delete set null,
  href          text not null,
  title         text not null,
  description   text not null,
  is_challenge  boolean not null default false,
  -- 'previous': locked behind the node before it (the default in code).
  -- 'explicit': locked behind exactly the rows in learning_path_prereqs (possibly none).
  prereq_mode   text not null default 'previous' check (prereq_mode in ('previous', 'explicit')),
  unique (path_id, position),
  unique (path_id, subject_slug, topic_slug)
);

create table public.learning_path_prereqs (
  node_id          uuid not null references public.learning_path_nodes (id) on delete cascade,
  requires_node_id uuid not null references public.learning_path_nodes (id) on delete cascade,
  primary key (node_id, requires_node_id),
  check (node_id <> requires_node_id)
);

-- ------------------------------------------------------------ question bank -
create table public.question_banks (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  subject_id     uuid not null references public.subjects (id) on delete restrict,
  title          text not null,
  description    text not null,
  subject_label  text not null,
  topic_label    text not null,
  back_href      text not null,
  difficulty     text not null check (difficulty in ('easy', 'medium', 'hard')),
  estimated_time integer not null,
  status         public.publish_status not null default 'published',
  content_hash   text not null,
  source_hash    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.exam_types (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  config       jsonb not null default '{}',
  status       public.publish_status not null default 'published',
  content_hash text not null,
  source_hash  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- One question model for quiz/practice questions and for exam questions.
-- Quiz questions belong to a subject (subject_id); exam questions carry an
-- exam-domain subject label (exam_subject) and get their topic/difficulty per
-- exam from question_exams, because the same question is filed differently by
-- different exams.
create table public.questions (
  id               uuid primary key default gen_random_uuid(),
  source_system    text not null check (source_system in ('quiz', 'mpt', 'teacher')),
  legacy_id        text not null,
  subject_id       uuid references public.subjects (id) on delete restrict,
  exam_subject     text,
  topic            text,
  concept          text,
  difficulty       text check (difficulty in ('easy', 'medium', 'hard')),
  stem             text not null,
  passage          text,
  options          jsonb not null,
  correct_index    integer not null,
  fixed_order      boolean not null default false,
  explanation      text not null default '',
  hints            jsonb,
  misconception_tag text,
  language         text check (language in ('en', 'ur', 'sd')),
  source_type      public.question_source not null,
  source_detail    text,
  source_exam      text,
  source_year      integer,
  source_reference text,
  source_note      text,
  answer_check     public.answer_check not null default 'unchecked',
  verified_note    text,
  needs_review     boolean not null default false,
  extra            jsonb not null default '{}',
  status           public.publish_status not null default 'published',
  content_hash     text not null,
  source_hash      text,
  reviewed_by      uuid,
  reviewed_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (source_system, legacy_id),

  constraint questions_options_shape check (
    jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 6
  ),
  constraint questions_correct_in_range check (
    correct_index >= 0 and correct_index < jsonb_array_length(options)
  ),
  constraint questions_one_subject_kind check ((subject_id is not null) <> (exam_subject is not null)),
  -- Provenance rules -------------------------------------------------------
  constraint questions_past_paper_has_year check (
    source_type <> 'verified_past_paper' or source_year is not null
  ),
  constraint questions_generated_never_verified check (
    source_type <> 'generated' or answer_check in ('unchecked', 'self_checked', 'recomputed')
  ),
  constraint questions_published_complete check (
    status <> 'published' or (btrim(stem) <> '' and btrim(explanation) <> '')
  )
);
create index questions_source_idx  on public.questions (source_system, source_type);
create index questions_subject_idx on public.questions (subject_id, topic);
create index questions_status_idx  on public.questions (status);
create index questions_hash_idx    on public.questions (content_hash);

create table public.question_bank_items (
  bank_id     uuid not null references public.question_banks (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete restrict,
  position    integer not null,
  primary key (bank_id, question_id),
  unique (bank_id, position)
);

create table public.question_exams (
  question_id  uuid not null references public.questions (id) on delete cascade,
  exam_type_id uuid not null references public.exam_types (id) on delete restrict,
  topic        text,
  subtopic     text,
  difficulty   text check (difficulty in ('easy', 'medium', 'hard')),
  section_code text,
  primary key (question_id, exam_type_id)
);
create index question_exams_exam_idx on public.question_exams (exam_type_id, section_code);

create table public.exam_sections (
  exam_type_id   uuid not null references public.exam_types (id) on delete cascade,
  code           text not null,
  title          text not null,
  subject        text not null,
  question_count integer not null check (question_count > 0),
  position       integer not null,
  branches       jsonb,
  primary key (exam_type_id, code)
);

-- A stored full-length mock (CSS MPT has two). Teacher-test mocks are generated
-- at runtime from exam_types.config, so they have no rows here.
create table public.exams (
  id              uuid primary key default gen_random_uuid(),
  exam_type_id    uuid not null references public.exam_types (id) on delete restrict,
  slug            text not null,
  title           text not null,
  total_questions integer not null check (total_questions > 0),
  time_minutes    integer not null check (time_minutes > 0),
  pass_marks      integer,
  negative_marking boolean not null default false,
  status          public.publish_status not null default 'published',
  content_hash    text not null,
  source_hash     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (exam_type_id, slug)
);

create table public.exam_questions (
  exam_id      uuid not null references public.exams (id) on delete cascade,
  position     integer not null,
  question_id  uuid not null references public.questions (id) on delete restrict,
  section_code text not null,
  primary key (exam_id, position),
  unique (exam_id, question_id)
);

-- ------------------------------------------------------------------ other ---
create table public.connections (
  id           uuid primary key default gen_random_uuid(),
  legacy_id    text not null unique,
  data         jsonb not null,
  status       public.publish_status not null default 'published',
  content_hash text not null,
  source_hash  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.media (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  mime         text not null,
  bytes        bigint not null check (bytes >= 0),
  alt_text     text not null check (btrim(alt_text) <> ''),
  license      text,
  source       text,
  uploaded_by  uuid,
  created_at   timestamptz not null default now()
);

-- Append-only: see the immutability trigger in migration 2.
create table public.audit_log (
  id          bigint generated always as identity primary key,
  at          timestamptz not null default now(),
  actor_id    uuid,
  actor_email text,
  actor_role  text,
  action      text not null,
  entity      text not null,
  entity_id   text,
  before      jsonb,
  after       jsonb,
  meta        jsonb
);
create index audit_log_at_idx     on public.audit_log (at desc);
create index audit_log_entity_idx on public.audit_log (entity, entity_id);
create index audit_log_actor_idx  on public.audit_log (actor_id, at desc);

-- updated_at maintenance -------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'subjects', 'topics', 'simulations', 'gle_topics', 'learning_paths', 'question_banks',
    'exam_types', 'questions', 'exams', 'connections'
  ] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',
      t || '_touch', t);
  end loop;
end $$;
