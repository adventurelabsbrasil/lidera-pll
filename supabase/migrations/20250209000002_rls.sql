-- RLS policies for PLL Members Area

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_content_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's profile (role, tenant_id, client_id)
CREATE OR REPLACE FUNCTION public.current_profile()
RETURNS public.profiles AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Tenants: super_admin sees all; tenant_admin sees own; end_user sees none for management (read-only for display)
CREATE POLICY "tenants_select_super_admin" ON public.tenants
  FOR SELECT USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "tenants_all_super_admin" ON public.tenants
  FOR ALL USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "tenants_select_tenant_admin" ON public.tenants
  FOR SELECT USING (
    id = (SELECT tenant_id FROM public.current_profile())
    AND (SELECT role FROM public.current_profile()) = 'tenant_admin'
  );

-- Clients: super_admin all; tenant_admin own tenant; end_user can read own client
CREATE POLICY "clients_select_super_admin" ON public.clients
  FOR SELECT USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "clients_all_super_admin" ON public.clients
  FOR ALL USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "clients_tenant_admin" ON public.clients
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM public.current_profile())
    AND (SELECT role FROM public.current_profile()) = 'tenant_admin'
  );

CREATE POLICY "clients_select_own" ON public.clients
  FOR SELECT USING (
    id = (SELECT client_id FROM public.current_profile())
    AND (SELECT role FROM public.current_profile()) = 'end_user'
  );

-- Profiles: users read own; tenant_admin reads same tenant; super_admin reads all
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_select_tenant_admin" ON public.profiles
  FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.current_profile())
    AND (SELECT role FROM public.current_profile()) = 'tenant_admin'
  );

CREATE POLICY "profiles_select_super_admin" ON public.profiles
  FOR SELECT USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "profiles_update_super_admin" ON public.profiles
  FOR UPDATE USING ((SELECT role FROM public.current_profile()) = 'super_admin');

-- Content groups: super_admin all; tenant_admin own tenant; end_user only if client has access
CREATE POLICY "content_groups_super_admin" ON public.content_groups
  FOR ALL USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "content_groups_tenant_admin" ON public.content_groups
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM public.current_profile())
    AND (SELECT role FROM public.current_profile()) = 'tenant_admin'
  );

CREATE POLICY "content_groups_end_user" ON public.content_groups
  FOR SELECT USING (
    (SELECT role FROM public.current_profile()) = 'end_user'
    AND id IN (
      SELECT content_group_id FROM public.client_content_access
      WHERE client_id = (SELECT client_id FROM public.current_profile())
    )
  );

-- Content items: same logic via content_groups
CREATE POLICY "content_items_super_admin" ON public.content_items
  FOR ALL USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "content_items_tenant_admin" ON public.content_items
  FOR ALL USING (
    content_group_id IN (
      SELECT id FROM public.content_groups
      WHERE tenant_id = (SELECT tenant_id FROM public.current_profile())
    )
    AND (SELECT role FROM public.current_profile()) = 'tenant_admin'
  );

CREATE POLICY "content_items_end_user" ON public.content_items
  FOR SELECT USING (
    (SELECT role FROM public.current_profile()) = 'end_user'
    AND content_group_id IN (
      SELECT content_group_id FROM public.client_content_access
      WHERE client_id = (SELECT client_id FROM public.current_profile())
    )
  );

-- Client content access: super_admin and tenant_admin manage; end_user only read (via content_groups)
CREATE POLICY "client_content_access_super_admin" ON public.client_content_access
  FOR ALL USING ((SELECT role FROM public.current_profile()) = 'super_admin');

CREATE POLICY "client_content_access_tenant_admin" ON public.client_content_access
  FOR ALL USING (
    client_id IN (SELECT id FROM public.clients WHERE tenant_id = (SELECT tenant_id FROM public.current_profile()))
    AND (SELECT role FROM public.current_profile()) = 'tenant_admin'
  );

CREATE POLICY "client_content_access_select_end_user" ON public.client_content_access
  FOR SELECT USING (
    client_id = (SELECT client_id FROM public.current_profile())
    AND (SELECT role FROM public.current_profile()) = 'end_user'
  );

-- User lesson progress: own row only for end_user; tenant_admin/super_admin can read for their scope
CREATE POLICY "user_lesson_progress_own" ON public.user_lesson_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "user_lesson_progress_tenant_admin_read" ON public.user_lesson_progress
  FOR SELECT USING (
    (SELECT role FROM public.current_profile()) = 'tenant_admin'
    AND content_item_id IN (
      SELECT ci.id FROM public.content_items ci
      JOIN public.content_groups cg ON cg.id = ci.content_group_id
      WHERE cg.tenant_id = (SELECT tenant_id FROM public.current_profile())
    )
  );

CREATE POLICY "user_lesson_progress_super_admin" ON public.user_lesson_progress
  FOR SELECT USING ((SELECT role FROM public.current_profile()) = 'super_admin');

-- User preferences: own only
CREATE POLICY "user_preferences_own" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Grant usage to authenticated and anon for auth
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.tenants TO authenticated;
GRANT SELECT ON public.clients TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.content_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.content_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_content_access TO authenticated;
GRANT ALL ON public.user_lesson_progress TO authenticated;
GRANT ALL ON public.user_preferences TO authenticated;
