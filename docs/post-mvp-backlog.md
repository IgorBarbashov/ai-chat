# Post-MVP Execution Backlog: AI Chat (GigaChat)

## Статус документа

**Активный план** текущего этапа разработки (post-MVP).

`docs/mvp-execution-backlog.md` — завершён, используется только как исторический/контекстный документ.

---

## MVP: итоговое состояние

| Задача | Статус |
|---|---|
| TASK-1: Vite proxy | ✅ |
| TASK-2: .env.local + auth.ts | ✅ |
| TASK-3: streamCompletion | ✅ |
| TASK-4: Состояние в AppLayout | ✅ |
| TASK-5: ChatWindow props | ⚠️ `messages` ✅, `loading` prop отсутствует — функционально покрыт Loader в Message |
| TASK-6: onSend + streaming | ✅ |
| TASK-7: Stop generation | ✅ |
| TASK-8: Typing indicator | ✅ |
| TASK-9: Автопрокрутка | ✅ |

### Технический долг после MVP

| Долг | Файл |
|---|---|
| Мёртвый код: `useChatMessages.ts` не удалён | `src/components/chat/ChatWindow/useChatMessages.ts` |
| Неиспользуемые экспорты: `activeChatId`, `onChatClick` | `src/mocks/chats.ts` |
| `docs/roadmap.md` не отражает прогресс AC-07/08/09 | `docs/roadmap.md` |

---

## Execution Order

```
PM-1 (error handling) → PM-2 (dead code cleanup) → PM-3 (empty state)
→ PM-4 (syntax highlighting) → PM-5 (localStorage) → PM-6 (new chat)
→ later: PM-7..PM-12
```

**Первая задача для терминала: PM-1.**

---

## Атомарные задачи

### PM-1: Обработка ошибок API

**Цель:** При сбое (истёкший токен, 401, сетевая ошибка) пользователь видит сообщение об ошибке, а не вечный Loader.

**Файлы:**
- `src/components/layout/AppLayout.tsx`

**Изменение:**
1. Добавить `const [error, setError] = useState<string | null>(null)`.
2. В `handleSend`:
   - перед запросом: `setError(null)`
   - в `catch (e)`: `setError(e instanceof Error ? e.message : 'Ошибка соединения')`
3. Рендерить `<Alert color="red" title="Ошибка" onClose={() => setError(null)}>` над `<InputArea>` когда `error !== null`. Использовать `Alert` из `@mantine/core` (уже установлен).

**Критерий готовности:** При недоступном API или пустом VITE_GIGACHAT_TOKEN появляется красный Alert с текстом ошибки. Предыдущие сообщения в чате сохраняются. `npm run build` проходит.

**Зависимости:** Нет.

---

### PM-2: Очистка технического долга

**Цель:** Убрать мёртвый код и привести репо в порядок.

**Файлы:**
- `src/components/chat/ChatWindow/useChatMessages.ts` — удалить файл
- `src/mocks/chats.ts` — удалить экспорты `activeChatId` и `onChatClick`
- `docs/roadmap.md` — отметить Фазу 1 и Фазу 2 как выполненные

**Изменение:**
1. Удалить `useChatMessages.ts` целиком.
2. В `mocks/chats.ts` оставить только `export const chats = [...]`.
3. В `roadmap.md` проставить `[x]` у всех пунктов Фазы 1 и Фазы 2; добавить статусы AC-07/08/09.

**Критерий готовности:** `npm run build` и `npm run lint` проходят без ошибок. Нет импортов `useChatMessages` в проекте.

**Зависимости:** Нет (параллельна с PM-1).

---

### PM-3: Empty state в чате

**Цель:** Когда чат пустой (новый или ещё без сообщений) — показывать placeholder вместо пустого контейнера.

**Файлы:**
- `src/components/chat/MessageList/MessageList.tsx`

**Изменение:**
Если `messages.length === 0` — рендерить `<Text c="dimmed" ta="center">` с текстом "Начните диалог" внутри контейнера `ScrollArea`, иначе — обычный список.

**Критерий готовности:** При переключении на чат без сообщений виден placeholder. После отправки первого сообщения он исчезает. `npm run build` проходит.

**Зависимости:** Нет.

---

### PM-4: Syntax highlighting

**Цель:** Подсветка кода в блоках ответов GigaChat.

**Файлы:** `src/components/chat/Message/Message.tsx`, `package.json`

**Изменение:** Добавить `rehype-highlight` как плагин в `ReactMarkdown` (новая зависимость — обосновано тем, что подсветка кода критична для технической аудитории и нет альтернативы внутри Mantine/react-markdown без внешнего пакета).

**Критерий готовности:** Блоки кода в ответах окрашены. `npm run build` проходит.

**Зависимости:** Нет, но брать после PM-1..PM-3.

---

### PM-5: localStorage persistence

**Цель:** История чатов не теряется при перезагрузке страницы.

**Файлы:** `src/components/layout/AppLayout.tsx`

**Изменение:**
1. При инициализации `messagesByChat`: читать из `localStorage` (`JSON.parse`).
2. В `useEffect` на `messagesByChat`: записывать в `localStorage` (`JSON.stringify`).
Можно вынести в хук `useLocalStorage` из `@mantine/hooks` (уже установлен — проверить API).

**Критерий готовности:** После `F5` история чатов сохраняется. `npm run build` проходит.

**Зависимости:** Нет, но логически идёт после PM-1..PM-3.

---

### PM-6: Создание нового чата

**Цель:** Кнопка "+" в сайдбаре создаёт пустой чат.

**Файлы:** `src/components/layout/AppLayout.tsx`, `src/components/sidebar/Sidebar.tsx`, `src/components/sidebar/sidebar.models.tsx`

**Изменение:**
1. `AppLayout`: перенести `chats` из мока в `useState<Chat[]>(mockChats)`. Добавить `handleNewChat`: создаёт `{ id: crypto.randomUUID(), title: 'Новый чат', lastMessageDate: new Date().toISOString() }`, добавляет в `chats`, делает `setActiveChatId`.
2. `Sidebar`: добавить `onNewChat?: () => void` в props, добавить кнопку "+" в шапку сайдбара.

**Критерий готовности:** Клик "+" создаёт новый чат и переключает на него. Чат пустой (empty state из PM-3). `npm run build` проходит.

**Зависимости:** PM-3 (для empty state нового чата), опционально PM-5 (для сохранения новых чатов).

---

## Остаток: задачи на потом

| ID | Задача | Причина отложить |
|---|---|---|
| PM-7 | Context + useReducer | Нужен только при ≥3 новых потребителях состояния |
| PM-8 | OAuth token auto-refresh | Ручная ротация достаточна для dev |
| PM-9 | Автогенерация заголовка | Зависит от стабильной работы PM-5 |
| PM-10 | Edit/Delete чатов | Зависит от PM-5 + PM-6 |
| PM-11 | Image attachments | Не в обязательных требованиях |
| PM-12 | Поиск по содержимому | Есть поиск по названию — достаточно |
