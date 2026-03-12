import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { SearchInputProps } from "./searchInput.models";
import styles from "./searchInput.module.css";

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <TextInput
      classNames={{
        root: styles.root,
        input: styles.input,
      }}
      placeholder="Поиск по чатам"
      size="xs"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      leftSection={<IconSearch size={14} />}
      leftSectionPointerEvents="none"
    />
  );
};
