-- =========================================================
-- MN PREMIUM SERVICE
-- BOOKING CONFIRMATION SYSTEM v1.4
-- MIGRATION 001
-- =========================================================

begin;

create extension if not exists pgcrypto;

alter table public.bookings
add column if not exists confirmation_token uuid;

alter table public.bookings
add column if not exists confirmed_at timestamptz;

alter table public.bookings
add column if not exists cancelled_at timestamptz;

alter table public.bookings
add column if not exists confirmation_sent_at timestamptz;

alter table public.bookings
add column if not exists confirmation_expires_at timestamptz;

alter table public.bookings
add column if not exists confirmation_attempts integer not null default 0;

update public.bookings
set confirmation_token = gen_random_uuid()
where confirmation_token is null;

alter table public.bookings
alter column confirmation_token
set default gen_random_uuid();

alter table public.bookings
alter column confirmation_token
set not null;

create unique index if not exists
bookings_confirmation_token_unique_idx
on public.bookings (confirmation_token);

create index if not exists
bookings_confirmed_at_idx
on public.bookings (confirmed_at);

create index if not exists
bookings_cancelled_at_idx
on public.bookings (cancelled_at);

create index if not exists
bookings_confirmation_expires_at_idx
on public.bookings (confirmation_expires_at);

commit;