-- Execute no SQL Editor do projeto Discípulo de Jesus, uma vez.
begin;
create table if not exists public.discipulo_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 1 check (revision > 0),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  constraint discipulo_save_format check (coalesce(
    jsonb_typeof(payload) = 'object'
    and payload->>'app' = 'discipulo-de-jesus'
    and payload->>'formatVersion' = '1'
    and jsonb_typeof(payload->'data') = 'object'
    and octet_length(payload::text) <= 5000000, false))
);
alter table public.discipulo_saves enable row level security;
revoke all on public.discipulo_saves from public, anon, authenticated;
grant select, insert, update on public.discipulo_saves to authenticated;
drop policy if exists discipulo_select_own on public.discipulo_saves;
create policy discipulo_select_own on public.discipulo_saves for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists discipulo_insert_own on public.discipulo_saves;
create policy discipulo_insert_own on public.discipulo_saves for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists discipulo_update_own on public.discipulo_saves;
create policy discipulo_update_own on public.discipulo_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Comparação de revisão dentro da mesma transação: saves concorrentes não se perdem.
create or replace function public.sync_discipulo_save(p_expected_revision bigint, p_payload jsonb)
returns setof public.discipulo_saves
language plpgsql security invoker set search_path = public, pg_temp as $$
declare saved public.discipulo_saves;
begin
  if auth.uid() is null then raise exception 'Login necessário' using errcode='42501'; end if;
  if p_expected_revision < 0 or p_expected_revision is null then raise exception 'Revisão inválida'; end if;
  if p_expected_revision = 0 then
    insert into public.discipulo_saves(user_id,revision,payload,updated_at)
    values(auth.uid(),1,p_payload,now()) on conflict (user_id) do nothing returning * into saved;
  else
    update public.discipulo_saves set payload=p_payload,revision=revision+1,updated_at=now()
    where user_id=auth.uid() and revision=p_expected_revision returning * into saved;
  end if;
  if not found then raise exception 'Save alterado em outro aparelho; tente novamente' using errcode='40001'; end if;
  return next saved;
end;
$$;
revoke all on function public.sync_discipulo_save(bigint,jsonb) from public, anon;
grant execute on function public.sync_discipulo_save(bigint,jsonb) to authenticated;
commit;
