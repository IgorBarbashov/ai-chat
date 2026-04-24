# Functional Specification

## Overview

<!-- Short description of what the application does -->

AI chat interface. Users can browse a list of conversations and read messages within each conversation.

## User flows

### View chat list

1. User opens the app.
2. Sidebar displays a list of recent chats (title + date).
3. User can filter chats by typing in the search input.

### Open a chat

1. User clicks a `ChatItem` in the sidebar.
2. `ChatWindow` shows a loading indicator.
3. After loading, messages are displayed in `MessageList`.
4. The active chat is highlighted in the sidebar.

### Send a message

<!-- Not yet implemented -->

- Input area is visible but send functionality is not yet wired up.

### Toggle theme

- User clicks the theme toggle in the header.
- App switches between light and dark mode.

## Out of scope (current iteration)

- Authentication
- Real API calls
- Message streaming
- Chat creation / deletion
- Routing / deep links
