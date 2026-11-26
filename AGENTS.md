# Правила проекта

- Это статическое портфолио на Next.js App Router, React и TypeScript.
- Не добавляй серверные функции, базу данных, формы или аналитику без отдельной задачи и записи в `docs/decisions.md`.
- Комментарии, метаданные, подписи и остальные текстовые значения в исходниках пишутся на английском. Русский текст сайта хранится только в `src/content/translations.ts` как локализация `ru`.
- Тексты интерфейса и локализуемые метаданные хранятся в `src/content/translations.ts`, данные проектов – в `src/content/projects.ts`.
- Изменения шейдера делай в `src/components/ambient/shaders.ts`; жизненный цикл Three.js – в `AmbientCanvas.tsx`.
- Перед изменением кода прочитай `docs/product.md` и `docs/decisions.md`; после изменения обнови описывающую документацию.
- Проверки проекта: `pnpm lint`, `pnpm typecheck`, `pnpm build`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
