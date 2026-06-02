-- Enable Row-Level Security on all application tables.
--
-- Supabase exposes the `public` schema through a PostgREST API reachable with
-- the project's anon key. Without RLS, anyone with the project URL could read
-- and write every table (including User.passwordHash, Account OAuth tokens,
-- ContactSubmission and LeadMagnetSubscriber PII).
--
-- Enabling RLS with NO policies denies all access to the `anon` and
-- `authenticated` Postgres roles used by the API. The application connects as
-- the `postgres` role (BYPASSRLS = true) via Prisma, so it is unaffected and
-- retains full access. Add explicit policies later only if you intentionally
-- want to expose specific rows through the public API.

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PodcastEpisode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CaseStudy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Page" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ContactSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LeadMagnetSubscriber" ENABLE ROW LEVEL SECURITY;
