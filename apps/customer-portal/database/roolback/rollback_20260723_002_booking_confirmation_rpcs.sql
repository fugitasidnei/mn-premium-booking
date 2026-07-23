-- =========================================================
-- MN PREMIUM SERVICE
-- BOOKING CONFIRMATION SYSTEM v1.4
-- ROLLBACK 002
-- ATENÇÃO:
-- EXECUTAR SOMENTE PARA REVERTER A MIGRATION 002
-- =========================================================

begin;

drop function if exists public.confirm_booking(uuid);
drop function if exists public.cancel_booking(uuid);

commit;