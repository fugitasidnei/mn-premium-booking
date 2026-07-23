-- =========================================================
-- MN PREMIUM SERVICE
-- BOOKING CONFIRMATION SYSTEM v1.4
-- MIGRATION 002
-- RPCS DE CONFIRMAÇÃO E CANCELAMENTO
-- =========================================================

begin;

create or replace function public.confirm_booking(
  booking_token uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_booking public.bookings%rowtype;
begin
  select *
  into target_booking
  from public.bookings
  where confirmation_token = booking_token
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'code', 'booking_not_found',
      'message', 'Booking not found.'
    );
  end if;

  update public.bookings
  set confirmation_attempts =
    confirmation_attempts + 1
  where id = target_booking.id;

  if target_booking.status = 'cancelled'
     or target_booking.cancelled_at is not null then
    return jsonb_build_object(
      'success', false,
      'code', 'booking_cancelled',
      'message', 'This booking has already been cancelled.'
    );
  end if;

  if target_booking.status = 'confirmed'
     or target_booking.confirmed_at is not null then
    return jsonb_build_object(
      'success', true,
      'code', 'already_confirmed',
      'message', 'This booking has already been confirmed.',
      'booking_id', target_booking.id
    );
  end if;

  if target_booking.confirmation_expires_at is not null
     and target_booking.confirmation_expires_at < now() then
    return jsonb_build_object(
      'success', false,
      'code', 'confirmation_expired',
      'message', 'The confirmation link has expired.'
    );
  end if;

  update public.bookings
  set
    status = 'confirmed',
    confirmed_at = now(),
    cancelled_at = null
  where id = target_booking.id;

  insert into public.booking_timeline (
    booking_id,
    event_type,
    title,
    description,
    old_value,
    new_value,
    created_by
  )
  values (
    target_booking.id,
    'customer_confirmation',
    'Booking confirmed by customer',
    'The customer confirmed the booking using the email confirmation link.',
    target_booking.status,
    'confirmed',
    'customer'
  );

  return jsonb_build_object(
    'success', true,
    'code', 'booking_confirmed',
    'message', 'Booking confirmed successfully.',
    'booking_id', target_booking.id
  );
end;
$$;

create or replace function public.cancel_booking(
  booking_token uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_booking public.bookings%rowtype;
begin
  select *
  into target_booking
  from public.bookings
  where confirmation_token = booking_token
  for update;

  if not found then
    return jsonb_build_object(
      'success', false,
      'code', 'booking_not_found',
      'message', 'Booking not found.'
    );
  end if;

  update public.bookings
  set confirmation_attempts =
    confirmation_attempts + 1
  where id = target_booking.id;

  if target_booking.status = 'cancelled'
     or target_booking.cancelled_at is not null then
    return jsonb_build_object(
      'success', true,
      'code', 'already_cancelled',
      'message', 'This booking has already been cancelled.',
      'booking_id', target_booking.id
    );
  end if;

  if target_booking.status = 'confirmed'
     or target_booking.confirmed_at is not null then
    return jsonb_build_object(
      'success', false,
      'code', 'booking_already_confirmed',
      'message', 'A confirmed booking cannot be cancelled using this link.'
    );
  end if;

  if target_booking.confirmation_expires_at is not null
     and target_booking.confirmation_expires_at < now() then
    return jsonb_build_object(
      'success', false,
      'code', 'confirmation_expired',
      'message', 'The cancellation link has expired.'
    );
  end if;

  update public.bookings
  set
    status = 'cancelled',
    cancelled_at = now(),
    confirmed_at = null
  where id = target_booking.id;

  insert into public.booking_timeline (
    booking_id,
    event_type,
    title,
    description,
    old_value,
    new_value,
    created_by
  )
  values (
    target_booking.id,
    'customer_cancellation',
    'Booking cancelled by customer',
    'The customer cancelled the booking using the email cancellation link.',
    target_booking.status,
    'cancelled',
    'customer'
  );

  return jsonb_build_object(
    'success', true,
    'code', 'booking_cancelled',
    'message', 'Booking cancelled successfully.',
    'booking_id', target_booking.id
  );
end;
$$;

revoke all
on function public.confirm_booking(uuid)
from public;

revoke all
on function public.cancel_booking(uuid)
from public;

grant execute
on function public.confirm_booking(uuid)
to anon, authenticated;

grant execute
on function public.cancel_booking(uuid)
to anon, authenticated;

commit;