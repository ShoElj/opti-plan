-- Revoke previously granted all privileges from anon
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public FROM anon;

-- Alter default privileges to revoke from anon
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON ROUTINES FROM anon;

-- Re-grant basic usage to anon so it can at least query but only what RLS allows, 
-- but actually Supabase anon usually only needs USAGE on schema and SELECT on specific tables.
GRANT USAGE ON SCHEMA public TO anon;
