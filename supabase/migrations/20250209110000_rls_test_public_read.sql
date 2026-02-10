-- Modo teste: permitir leitura de conteúdo sem login.
-- REMOVER ou reverter quando for configurar acessos de produção.

CREATE POLICY "content_groups_select_public_test" ON public.content_groups
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "content_items_select_public_test" ON public.content_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "client_content_access_select_public_test" ON public.client_content_access
  FOR SELECT TO anon, authenticated USING (true);
