# Сборка и размещение

## Локальная разработка

- Установить зависимости командой `pnpm install`.
- Запустить `pnpm dev` и открыть локальный адрес, показанный Next.js.
- Перед подготовкой файлов выполнить `pnpm lint`, `pnpm typecheck` и `pnpm build`.

## Статическая сборка

Команда `pnpm build` создаёт каталог `out/`. Его содержимое размещается на статическом хостинге с поддержкой путей `/` и `/ru/`.

## GitHub Pages

The deploy workflow publishes the static export from `main` at <https://www.bvitriak.site/>. Pages manages the custom domain and enforces HTTPS. English is served at `/` and Russian at `/ru/`. Both locales load styles, scripts, fonts, and the favicon from the domain root.

Pull requests run `pnpm check` before merging. To publish the current version of `main` again, run the deploy workflow from the Actions tab.

See [GitHub governance](./github-governance.md) for repository settings.
