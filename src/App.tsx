import { MantineProvider } from '@mantine/core';
import { AppLayout } from './components/layout';
import "@mantine/core/styles.css";

export function App() {
  return (
    <MantineProvider>
      <AppLayout />
    </MantineProvider>
  )
};
