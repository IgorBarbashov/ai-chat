# Architecture

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build tool | Vite 8 |
| UI library | Mantine v8 (`@mantine/core`, `@mantine/hooks`) |
| Icons | `@tabler/icons-react` |
| Markdown | `react-markdown` |

## Folder structure

```
src/
  components/
    layout/         # AppLayout (AppShell)
    sidebar/        # Sidebar, ChatList, ChatItem, SearchInput
    chat/           # ChatWindow, MessageList, Message, InputArea
    themeToggle/    # ThemeToggle
  entities/
    chat/           # Chat interface (id, title, lastMessageDate)
  mocks/
    chats.ts        # Static mock data
  styles/
    global.css
  App.tsx
  main.tsx
docs/
  ui-spec.md
  functional-spec.md
  architecture.md
  roadmap.md
  tasks/
```

## Path aliases

| Alias | Resolves to |
|---|---|
| `@components` | `src/components` |
| `@entities` | `src/entities` |
| `@mocks` | `src/mocks` |

## Data flow

```
mocks/chats.ts
  └─> Sidebar (chat list)
  └─> ChatWindow
        └─> useChatMessages (mock, 500 ms delay)
              └─> MessageList
                    └─> Message
```

Currently all data is static. No API client, no router, no global state manager.

## Key interfaces

```ts
// src/entities/chat/chat.models.ts
interface Chat {
  id: string;
  title: string;
  lastMessageDate: string;
}

// src/components/chat/ChatWindow/ChatWindow.models.ts
type MessageVariant = "user" | "assistant";

interface ChatMessage {
  id: string;
  chatId: string;
  author: string;
  variant: MessageVariant;
  text: string;
  createdAt: string;
}
```

## Future considerations

<!-- API integration, routing, global state, auth — to be defined -->
