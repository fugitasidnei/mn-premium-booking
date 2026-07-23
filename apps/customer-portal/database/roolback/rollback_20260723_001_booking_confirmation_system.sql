-- =========================================================
-- MN PREMIUM SERVICE
-- BOOKING CONFIRMATION SYSTEM v1.4
-- ROLLBACK 001
-- ATENÇÃO:
-- EXECUTAR SOMENTE SE FOR NECESSÁRIO REVERTER A MIGRATION
-- =========================================================

begin;

drop index if exists
public.bookings_confirmation_expires_at_idx;

drop index if exists
public.bookings_cancelled_at_idx;

drop index if exists
public.bookings_confirmed_at_idx;

drop index if exists
public.bookings_confirmation_token_unique_idx;

alter table public.bookings
drop column if exists confirmation_attempts;

alter table public.bookings
drop column if exists confirmation_expires_at;

alter table public.bookings
drop column if exists confirmation_sent_at;

alter table public.bookings
drop column if exists cancelled_at;

alter table public.bookings
drop column if exists confirmed_at;

alter table public.bookings
drop column if exists confirmation_token;

commit;