# Архитектура

## Структура директорий

```
src/
├── components/          # React-компоненты, сгруппированные по фиче
│   ├── chat/
│   │   ├── ChatWindow/
│   │   ├── InputArea/
│   │   ├── Message/
│   │   └── MessageList/
│   ├── layout/
│   │   └── AppLayout/
│   ├── sidebar/
│   │   ├── elements/
│   │   └── Sidebar/
│   └── themeToggle/
├── entities/            # TypeScript-модели данных
│   └── chat/
├── mocks/               # Моковые данные для разработки
└── styles/              # Глобальные стили и CSS-переменные
```

## Дерево компонентов

```
App
└── AppLayout
    ├── Sidebar
    │   ├── SearchInput
    │   └── ChatList
    │       └── ChatItem
    └── ChatWindow
        ├── MessageList
        │   └── Message
        └── InputArea
```

## Поток данных

- `AppLayout` хранит `activeChatId` и передаёт его в `Sidebar` (для выделения) и `ChatWindow` (для загрузки сообщений)
- `useChatMessages(activeChatId)` — загружает сообщения чата (сейчас мок, в будущем — API)
- `useInputArea` — управляет состоянием поля ввода; отправка сообщений — placeholder

## API-слой (не реализован)

Планируется выделить отдельный слой `src/api/` по паттерну адаптер:
- `gigachat/auth.ts` — OAuth-авторизация
- `gigachat/chat.ts` — отправка сообщений, стриминг SSE

## State Management

Текущий подход: локальный `useState` + кастомные хуки.  
Планируется: `Context API + useReducer` для глобального состояния чатов.

## Соглашения по именованию

См. `docs/rules.md`.
