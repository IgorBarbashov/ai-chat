# MVP Execution Backlog: AI Chat (GigaChat)

## Strict MVP Scope

Demo flow: выбрать чат → написать сообщение → отправить → увидеть стриминг-ответ от GigaChat → увидеть индикатор загрузки → нажать Stop.

**В MVP входит:**
- Выбор чата из списка (переключение activeChatId)
- Отправка сообщения → появляется в чате
- Стриминг ответа от GigaChat (fetch + ReadableStream SSE)
- Typing indicator пока идёт ответ
- Stop generation (AbortController)
- Автопрокрутка к последнему сообщению

**Не входит в MVP:**
- Context + useReducer (заменяем на useState в AppLayout)
- localStorage / IndexedDB
- Создание нового чата (кнопка остаётся без обработчика)
- Edit / Delete чатов
- Автогенерация заголовка
- Поиск по содержимому
- Syntax highlighting
- OAuth token refresh (ручная ротация в .env.local)
- Image attachments

---

## Ключевое упрощение

**Отказ от Context + useReducer для MVP.** AppLayout уже является общим родителем `ChatWindow` и `InputArea`. Добавляем 4 переменные состояния через `useState` — вся координация решена без 5 новых файлов бойлерплейта. Рефакторинг в Context — пост-MVP.

---

## Post-MVP

| Задача | Почему не сейчас |
|---|---|
| Context + useReducer | Не нужен для demo flow |
| Создание/удаление/переименование чатов | Кнопки есть, MVP не требует |
| localStorage / IndexedDB | Нет в обязательных критериях |
| Автообновление OAuth токена | Ручная ротация достаточна для dev |
| Syntax highlighting | Нужна новая зависимость, не критично |
| Image multimodal | Сложно, не в 6 обязательных |
| Поиск по содержимому | Есть поиск по названию, достаточно |

---

## Atomic Execution Backlog

### TASK-1: Vite proxy для GigaChat API
**Цель:** Обойти CORS и самоподписанный сертификат в dev.

**Файл:** `vite.config.ts`

**Изменение:** Добавить `server.proxy` — маршрут `/api/v1` проксирует на `https://gigachat.devices.sberbank.ru` с `secure: false`.

**Критерий готовности:** `npm run dev` запускается без ошибок; `curl localhost:5173/api/v1/models` отвечает (не CORS error).

**Независима:** Да.

---

### TASK-2: .env.local + auth.ts
**Цель:** Статический Bearer token доступен из кода через единую точку входа.

**Файлы:**
- `.env.local` (новый, не коммитить)
- `src/api/gigachat/auth.ts` (новый)

**Изменение:** `.env.local` содержит `VITE_GIGACHAT_TOKEN=...`; `auth.ts` экспортирует `getToken(): string`, читает `import.meta.env.VITE_GIGACHAT_TOKEN`, бросает понятную ошибку если пусто.

**Критерий готовности:** `getToken()` возвращает токен без ошибок; если переменная отсутствует — сообщение "VITE_GIGACHAT_TOKEN is not set".

**Независима:** Да.

---

### TASK-3: API адаптер — streamCompletion
**Цель:** Один async generator, который делает SSE-запрос к GigaChat и отдаёт токены.

**Файлы:**
- `src/api/gigachat/gigachat.models.ts` (новый) — типы `GigaChatMessage`, `StreamChunk`
- `src/api/gigachat/chat.ts` (новый) — `streamCompletion(messages, signal, options?)`
- `src/api/gigachat/index.ts` (новый) — реэкспорт

**Изменение:** `chat.ts` делает POST на `/api/v1/chat/completions` с `stream: true`, читает `ReadableStream`, буферизует по `\n\n`, парсит `data: {...}`, yield `choices[0].delta.content`, останавливается на `[DONE]` или `signal.aborted`. Модель: `"GigaChat"`.

**Критерий готовности:** Функцию можно вызвать вручную в `main.tsx` и увидеть токены в console.

**Независима:** Зависит от TASK-1 и TASK-2.

---

### TASK-4: Поднять состояние в AppLayout
**Цель:** AppLayout становится источником истины для activeChatId, сообщений и статуса загрузки.

**Файлы:**
- `src/components/layout/AppLayout.tsx`

**Изменение:** Убрать импорт `{ chats, activeChatId, onChatClick }` из `@mocks/chats`. Добавить:
```ts
const [activeChatId, setActiveChatId] = useState(chats[0].id);
const [messagesByChat, setMessagesByChat] = useState<Record<string, ChatMessage[]>>({});
const [isLoading, setIsLoading] = useState(false);
const abortRef = useRef<AbortController | null>(null);
```
`chats` остаётся из мока (список в сайдбаре — без изменений). `onChatClick` → `setActiveChatId`. Передать `activeChatId`, текущие сообщения и `isLoading` в ChatWindow.

**Критерий готовности:** Клик по чату переключает activeChatId; UI не сломан; mock-сообщения больше не отображаются.

**Независима:** Нет. Делать одновременно с TASK-5.

---

### TASK-5: Обновить ChatWindow — принимать messages + loading как props
**Цель:** ChatWindow больше не вызывает useChatMessages с моком, получает данные сверху.

**Файлы:**
- `src/components/chat/ChatWindow/ChatWindow.tsx`
- `src/components/chat/ChatWindow/ChatWindow.models.ts`

**Изменение:** Добавить `messages: ChatMessage[]` и `loading: boolean` в `ChatWindowProps`. Убрать вызов `useChatMessages(activeChatId)`. `useChatWindowState` оставить как есть.

**Критерий готовности:** TypeScript не ругается; при передаче пустого массива отображается пустой чат; `npm run build` проходит.

**Независима:** Параллельна с TASK-4.

---

### TASK-6: Подключить отправку — onSend вызывает streamCompletion
**Цель:** Пользователь пишет сообщение → оно появляется → приходит стриминг-ответ токен за токеном.

**Файлы:**
- `src/components/layout/AppLayout.tsx`

**Изменение:** Реализовать `handleSend(text)`:
1. Добавить user-сообщение в `messagesByChat[activeChatId]`
2. Добавить пустой assistant-placeholder
3. `setIsLoading(true)`, создать `AbortController`
4. `for await (const token of streamCompletion(...))` → патчить последнее сообщение через `setMessagesByChat`
5. В `finally`: `setIsLoading(false)`

Передать `handleSend` в `<InputArea onSend={handleSend} />`.

**Критерий готовности:** Сообщение отправлено, ответ GigaChat стримится в чат токен за токеном.

**Независима:** Нет. Зависит от TASK-3, TASK-4, TASK-5.

---

### TASK-7: Stop generation
**Цель:** Кнопка Stop прерывает стриминг, частичный ответ остаётся в чате.

**Файлы:**
- `src/components/layout/AppLayout.tsx`
- `src/components/chat/InputArea/InputArea.tsx`
- `src/components/chat/InputArea/InputArea.models.tsx`
- `src/components/chat/InputArea/useInputArea.ts`

**Изменение:** Добавить `onStop?: () => void` в `InputAreaProps`; убрать заглушку в `handleStop`; в AppLayout передать `onStop={() => abortRef.current?.abort()}`. Передать `isStreaming={isLoading}` чтобы показывать Stop кнопку только во время загрузки.

**Критерий готовности:** Клик на Stop обрывает стриминг; в чате остаётся частичный ответ.

**Независима:** Нет. Зависит от TASK-6.

---

### TASK-8: Typing indicator
**Цель:** Пока идёт ответ — видно что "GigaChat печатает".

**Файлы:**
- `src/components/chat/Message/Message.tsx`

**Изменение:** Если `variant === 'assistant'` и `text === ''` — рендерить `<Loader size="xs" />` вместо пустого контента.

**Критерий готовности:** После отправки сразу виден лоадер внутри assistant-сообщения; исчезает когда приходит первый токен.

**Независима:** Нет. Зависит от TASK-6.

---

### TASK-9: Автопрокрутка
**Цель:** После каждого нового токена/сообщения — прокрутка вниз.

**Файлы:**
- `src/components/chat/MessageList/MessageList.tsx`

**Изменение:** Добавить `<div ref={bottomRef} />` в конце списка; `useEffect` на `messages` → `bottomRef.current?.scrollIntoView({ behavior: 'smooth' })`.

**Критерий готовности:** Чат автоматически скроллится к последнему сообщению.

**Независима:** Зависит от TASK-5, можно делать параллельно с TASK-6.

---

## Граф зависимостей

```
TASK-1 (proxy) ─┐
                 ├─> TASK-3 (API adapter) ─┐
TASK-2 (auth)  ─┘                          │
                                            ├─> TASK-6 (onSend + streaming)
TASK-4 (AppLayout state) ─┐                │         │
                           ├─> TASK-6 ─────┘    TASK-7 (Stop)
TASK-5 (ChatWindow props) ─┘                         │
                                               TASK-8 (typing indicator)

TASK-9 (autoscroll) ← зависит от TASK-5, параллелен TASK-6
```

---

## Первая задача: TASK-1

**Почему:** независима, 3-4 строки кода, разблокирует всю API-работу.

**Проверка после TASK-1:**
```bash
npm run dev
# В другом терминале:
curl -s http://localhost:5173/api/v1/models \
  -H "Authorization: Bearer $TOKEN" | head -c 200
```
Ожидаем JSON с моделями — не CORS error и не SSL error.

---

## Вторая задача: TASK-2 + TASK-3 (один блок)

**Проверка после TASK-2 + TASK-3:**
Временно в `main.tsx`:
```ts
import { streamCompletion } from './api/gigachat';
(async () => {
  for await (const token of streamCompletion(
    [{ role: 'user', content: 'Привет!' }],
    new AbortController().signal
  )) {
    console.log('token:', token);
  }
})();
```
Ожидаем токены в DevTools консоли. После проверки — убрать из `main.tsx`.

---

## Trade-offs

| Решение | Компромисс |
|---|---|
| useState в AppLayout вместо Context | AppLayout немного разрастается; Context — пост-MVP рефакторинг |
| Статический VITE_GIGACHAT_TOKEN | Ручная ротация раз в ~час; OAuth refresh — пост-MVP |
| window.confirm вместо @mantine/modals | Не нужна новая зависимость; красивый confirm — пост-MVP |
| Mock-список чатов в сайдбаре остаётся | Sidebar не трогаем; CRUD чатов — пост-MVP |
| useChatMessages.ts не удаляем | Не ломаем git history; просто перестаём вызывать из ChatWindow |
| SSE через fetch (не EventSource) | EventSource не поддерживает POST + custom headers — fetch единственный вариант |
