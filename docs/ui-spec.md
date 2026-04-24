# UI Specification

## Layout

<!-- Describe AppShell structure: navbar (sidebar), header, main content area -->

### AppShell

- Collapsible navbar (sidebar) — left panel
- Header — top bar
- Main — chat window area

## Theming

<!-- Light / dark mode toggle. Mantine ColorScheme. -->

- Mantine v8 theme provider in `main.tsx`
- Theme toggle component: `src/components/themeToggle/ThemeToggle.tsx`
- Color scheme: light / dark

## Components

### Sidebar

<!-- Search input, chat list, active item highlight, long-title truncation -->

| Element | Description |
|---|---|
| `SearchInput` | Filters chat list by title |
| `ChatList` | Renders the list of `ChatItem` |
| `ChatItem` | Single row: title (truncated) + date |

### ChatWindow

<!-- Loading state, message list, input area -->

| Element | Description |
|---|---|
| Loading state | Shown while messages are fetched (500 ms mock delay) |
| `MessageList` | Scrollable list of messages |
| `InputArea` | Text input + send action |

### Message

| Variant | Layout |
|---|---|
| `user` | Right-aligned bubble |
| `assistant` | Left-aligned bubble with avatar |

Markdown is rendered inside message text via `react-markdown`.

## Responsive behavior

<!-- To be defined -->
