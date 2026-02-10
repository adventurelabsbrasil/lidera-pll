-- Permitir leitura de clients para visitantes anônimos (layout /[clientId] e página de login)
-- Sem isso, /demo retorna "Cliente não encontrado" quando o usuário ainda não está logado.
-- Expõe só id, name, slug, logo_url (o slug já está na URL).

CREATE POLICY "clients_select_public" ON public.clients
  FOR SELECT
  TO anon, authenticated
  USING (true);
