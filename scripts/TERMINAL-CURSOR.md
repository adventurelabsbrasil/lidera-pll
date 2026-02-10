# Terminal no Cursor

O Cursor usa um **terminal integrado** para rodar comandos durante a criação do app e no dia a dia.

## Abrir o terminal

- **Atalho:** `` Ctrl+` `` (Control + backtick) ou **Cmd+J** para abrir o painel inferior.
- **Menu:** View → Terminal.
- **Novo terminal:** no painel do terminal, clique no **+** ou em "Split Terminal".

O terminal abre na pasta do workspace (raiz do projeto).

## Configuração aplicada

- **Shell:** zsh (padrão no macOS).
- **Pasta inicial:** pasta do projeto (`workspaceFolder`).
- **Sessões persistentes** e scrollback aumentado.

Isso está em:
- Suas configurações globais do Cursor (User settings).
- Este projeto: `.vscode/settings.json` (só para esta pasta).

## Comandos que precisam de interação

Alguns comandos abrem o navegador ou pedem confirmação (ex.: `vercel login`, `supabase login`). Rode esses **no terminal do Cursor** (View → Terminal), não pelo Agent, para poder interagir.

## Terminal externo (opcional)

Se quiser usar um app separado (ex.: iTerm2):

1. Instale o terminal (ex.: iTerm2 pelo site ou, se tiver Homebrew: `brew install --cask iterm2`).
2. No Cursor: **Terminal** → **Open in External Terminal** (ou atalho configurado) abre o terminal externo na pasta do projeto.

O Cursor continua usando o terminal integrado para rodar comandos automaticamente; o externo é só para quando você preferir.
