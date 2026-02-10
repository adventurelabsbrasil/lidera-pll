# Primeiro uso do PLL (super_admin, tenant, cliente)

As migrations já foram aplicadas no Supabase. Siga estes passos para poder acessar o app e criar tenant + cliente.

---

## 1. Definir um usuário como Super Admin

Você precisa de um usuário em **auth.users** (criado pelo próprio app ao se cadastrar, ou pelo Supabase Auth). Depois, atribua `role = super_admin` na tabela **profiles**.

### Opção A: Pelo Table Editor (Supabase Dashboard)

1. Acesse [Supabase] ) → projeto **pnqpzutnanotzbefxxid**.
2. **Authentication** → **Users**: se ainda não tem usuário, crie um (Add user → e-mail e senha) ou use "Sign up" no app (https://lidera-pll-gamma.vercel.app) para criar a conta.
3. **Table Editor** → **profiles**: localize a linha do seu usuário (mesmo `id` de **auth.users** ou pelo e-mail).
4. Edite o campo **role** para `super_admin` e salve.

### Opção B: Criar todos os níveis via SQL (recomendado)

No Supabase → **SQL Editor**, execute o script que cria tenant, cliente e usuários nos três níveis:

- **Arquivo:** `supabase/seed_usuarios_niveis.sql`  
- Cria tenant **Lidera**, cliente **Demo**, e 3 usuários: **super_admin** (super@pll.local), **tenant_admin** (admin@lidera.local), **end_user** (usuario@demo.local). Senha padrão: **TrocarSenha123!**
- Se o INSERT em `auth.users` falhar (em alguns projetos não é permitido), crie os 3 usuários no Dashboard (Authentication → Add user) com esses e-mails e a senha acima e execute de novo só a **seção 3** do script, ou use o script alternativo abaixo.

**Script alternativo (só níveis, para e-mails que você já tem):** `supabase/seed_apenas_niveis_por_email.sql` — edite os e-mails no arquivo e execute para atribuir super_admin, tenant_admin e end_user.

### Opção C: Um único super_admin por e-mail

Execute (troque `'seu@email.com'` pelo e-mail do usuário):

```sql
UPDATE public.profiles
SET role = 'super_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'seu@email.com' LIMIT 1);
```

---

## 2. Criar tenant e cliente no app

1. Acesse **https://lidera-pll-gamma.vercel.app** e faça **login** com o usuário que está como `super_admin`.
2. Vá em **/super-admin** (ou clique em "Super Admin" no menu do admin, se estiver em /admin).
3. **Tenants** → crie um tenant, por exemplo:
   - Nome: **Lidera**
   - Slug: **lidera**
4. **Clientes** → crie um cliente, por exemplo:
   - Tenant: **Lidera**
   - Nome: **Demo**
   - Slug: **demo**
5. A área do membro para esse cliente será: **https://lidera-pll-gamma.vercel.app/demo**

---

## 3. (Opcional) Definir um usuário como Lidera (tenant admin)

Para que alguém gerencie conteúdos e acessos do tenant Lidera:

1. No Supabase, **Table Editor** → **profiles**: edite o perfil desse usuário.
2. Defina **role** = `tenant_admin` e **tenant_id** = id do tenant "Lidera" (copie da tabela **tenants**).
3. Esse usuário poderá acessar **/admin** e criar conteúdos e atribuir acessos.

---

## 4. (Opcional) Conteúdo e acesso para o cliente

1. Com um usuário **tenant_admin** (Lidera), acesse **https://lidera-pll-gamma.vercel.app/admin**.
2. **Conteúdos** → crie um conteúdo (grupo), depois adicione aulas (itens) com vídeo ou texto.
3. **Acessos** → vincule o cliente (ex.: Demo) ao conteúdo criado.
4. Usuários finais com **role** = `end_user` e **client_id** = id do cliente "Demo" verão esse conteúdo em **/demo/conteudo** e **/demo/conteudos-adquiridos**.

Para testar como usuário final: crie outro usuário no app, no Supabase edite **profiles** e defina **role** = `end_user` e **client_id** = id do cliente Demo; faça login e acesse **/demo**.

---

## Resumo rápido

| Passo | Onde | Ação |
|-------|------|------|
| 1 | Supabase (profiles) | Definir um usuário com `role = super_admin` |
| 2 | App → /super-admin | Login → criar tenant (ex.: Lidera) e cliente (ex.: Demo) |
| 3 | App → /demo | Área do membro do cliente "Demo" |
| 4 | Supabase (profiles) | Opcional: definir `tenant_admin` para alguém do Lidera |
| 5 | App → /admin | Opcional: criar conteúdo e atribuir acesso ao cliente |
