import { Group, ThemeIcon, UnstyledButton, Text } from "@mantine/core";
import Link from "next/link";

const MainLink = ({
  icon,
  color,
  label,
  route,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  route: string;
}) => {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Link href={route}>
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </Link>
    </UnstyledButton>
  );
};

export default MainLink;
