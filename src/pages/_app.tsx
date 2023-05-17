import { type AppType } from "next/app";
import {
  AppShell,
  Group,
  Header,
  MantineProvider,
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Text,
  ScrollArea,
} from "@mantine/core";
import { SpotlightProvider } from "@mantine/spotlight";
import { IconChecklist } from "@tabler/icons-react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Link from "next/link";
import { type NextRouter, useRouter } from "next/router";

function MainLink({
  icon,
  color,
  label,
  route,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  route: string;
}) {
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
}

const spotlightActions = (router: NextRouter) => [
  {
    title: "Check Vault",
    onTrigger: () => router.push("/check-vault"),
    icon: <IconChecklist />,
  },
];

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <SpotlightProvider actions={spotlightActions(router)}>
        <AppShell
          padding="md"
          navbar={
            <Navbar p="xs" width={{ base: 300 }}>
              <Navbar.Section grow mt="md">
                <MainLink
                  label="Check Vault"
                  color="green"
                  icon={<IconChecklist />}
                  route="/check-vault"
                />
              </Navbar.Section>
            </Navbar>
          }
          header={
            <Header height={60} p="xs">
              <Text fz="xl">Wowaudit Tools</Text>
            </Header>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
              height: "100vh",
              overflow: "hidden",
            },
          })}
        >
          <ScrollArea
            style={{
              height: "calc(100vh - 60)",
            }}
          >
            <Component {...pageProps} />
          </ScrollArea>
        </AppShell>
      </SpotlightProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
