import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export const ThemeToggle = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggle = () =>
    setColorScheme(colorScheme === "light" ? "dark" : "light");

  return (
    <ActionIcon
      variant="subtle"
      aria-label="Toggle color scheme"
      onClick={toggle}
    >
      {colorScheme === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
    </ActionIcon>
  );
};
