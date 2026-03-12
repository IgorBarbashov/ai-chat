import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { AppLayout } from './components/layout';
import "@mantine/core/styles.css";
import "./styles/global.css";

export function App() {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider
        defaultColorScheme="light"
        withCssVariables
      >
        <AppLayout />
      </MantineProvider>
    </>
  )
};
