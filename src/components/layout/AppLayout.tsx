import { AppShell, Header, Navbar, ScrollArea, Text } from "@mantine/core";
import MainLink from "./MainLink";
import { IconChecklist } from "@tabler/icons-react";
import { actions } from "../actions";

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
                icon={<IconChecklist />}
                route={action.route}
              />
            ))}
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
        {props.children}
      </ScrollArea>
    </AppShell>
  );
};

export default AppLayout;
