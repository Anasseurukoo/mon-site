create schema if not exists private;

create table if not exists private.bba_ai_rate_limits (
  client_hash text not null,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (client_hash, window_started_at)
);

revoke all on schema private from public, anon, authenticated;
revoke all on table private.bba_ai_rate_limits from public, anon, authenticated;

create or replace function private.consume_bba_ai_rate_limit(
  p_client_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window timestamptz;
  v_count integer;
begin
  if p_client_hash !~ '^[0-9a-f]{64}$' or p_limit < 1 or p_window_seconds < 60 then
    raise exception 'invalid rate limit arguments';
  end if;
  v_window := to_timestamp(floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds);
  insert into private.bba_ai_rate_limits (client_hash, window_started_at, request_count)
  values (p_client_hash, v_window, 1)
  on conflict (client_hash, window_started_at)
  do update set request_count = private.bba_ai_rate_limits.request_count + 1
  returning request_count into v_count;
  if random() < 0.02 then
    delete from private.bba_ai_rate_limits
    where window_started_at < v_now - make_interval(secs => p_window_seconds * 2);
  end if;
  return query select
    v_count <= p_limit,
    greatest(1, ceil(extract(epoch from (v_window + make_interval(secs => p_window_seconds) - v_now)))::integer);
end;
$$;

revoke all on function private.consume_bba_ai_rate_limit(text, integer, integer) from public, anon, authenticated;
grant usage on schema private to postgres, service_role;
grant select, insert, update, delete on private.bba_ai_rate_limits to postgres, service_role;
grant execute on function private.consume_bba_ai_rate_limit(text, integer, integer) to postgres, service_role;
