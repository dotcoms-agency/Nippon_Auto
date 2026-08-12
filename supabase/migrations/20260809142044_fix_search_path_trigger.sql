/*
# Fix: Set search_path on update_updated_at trigger function

Security hardening: explicitly set search_path to prevent search_path injection.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
