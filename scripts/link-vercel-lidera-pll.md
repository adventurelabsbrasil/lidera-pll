# Conectar esta pasta ao projeto Vercel **lidera-pll**

O projeto está (ou estava) ligado a outro na Vercel. Para apontar para o **lidera-pll**:

## 1. Abra o terminal na pasta do projeto

```bash
cd "/Users/ribasrodrigo91/Documents/GitHub/Adventure Labs/Sem Título"
```

## 2. Desvincular do projeto atual (se existir)

Se já existir a pasta `.vercel`, remova para forçar um novo link:

```bash
rm -rf .vercel
```

## 3. Vincular ao projeto **lidera-pll**

```bash
npx vercel link --yes --project lidera-pll
```

Se você tiver **mais de um time** na Vercel, pode ser preciso informar o scope:

```bash
npx vercel link --yes --project lidera-pll --scope nome-do-seu-time
```

Para ver os scopes: `npx vercel teams list` (ou no dashboard, canto superior esquerdo).

## 4. Conferir

- Deve aparecer algo como: *"Linked to [time]/lidera-pll"*.
- A pasta `.vercel` será criada (está no .gitignore).
- Depois: `npx vercel` = deploy preview; `npx vercel --prod` = produção.

## 5. Se pedir para criar novo projeto

Se o CLI disser que **lidera-pll** não existe ou perguntar se quer criar:

1. Confirme no dashboard [vercel.com](https://vercel.com) se o projeto se chama exatamente **lidera-pll** (e em qual time está).
2. Use o **Project ID** em vez do nome:
   - Dashboard → projeto **lidera-pll** → **Settings** → no topo ou na URL aparece o ID (ex.: `prj_xxxxx`).
   - Rode: `npx vercel link --yes --project prj_XXXXX`
3. Ou rode **sem** `--yes` e escolha na lista:
   ```bash
   npx vercel link
   ```
   Depois selecione "Link to existing project" e escolha **lidera-pll** na lista.
