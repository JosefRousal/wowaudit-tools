import {
  AppShell,
  Group,
  Header,
  Navbar,
  ScrollArea,
  Text,
} from "@mantine/core";
import MainLink from "./MainLink";
import { actions } from "../actions";
import AuthButton from "../AuthButton";

const AppLayout = (props: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar p="xs" width={{ base: 300 }}>
          <Navbar.Section grow mt="md">
            {actions.map((action, index) => (
              <MainLink
                key={index}
                label={action.title}
                color="green"
                icon={action.icon}
                route={action.route}
              />
            ))}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Group grow>
            <Text h="1" fz="xl">
              Wowaudit Tools
            </Text>
            <AuthButton />
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          height: "100vh",
        },
      })}
    >
      <ScrollArea
        style={{
          height: "calc(100vh - 60)",
        }}
      >
        {props.children}
      </ScrollArea>
    </AppShell>
  );
};

export default AppLayout;
